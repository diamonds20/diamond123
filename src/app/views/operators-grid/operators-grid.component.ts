import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Subscription } from 'rxjs';
import { CompanyService } from 'src/utils/company.service';
import { CONSTANT } from 'src/constants/constants';
import { mapOperatorData, getOperatorRoles } from 'src/utils/operators.service';
import { Role, Operator } from 'src/utils/models';
import { ModalModule } from '@coreui/angular';
import { RowComponent, ColComponent } from '@coreui/angular';
import { RouterLink } from '@angular/router';
import { PageItemDirective, PageLinkDirective, PaginationComponent } from '@coreui/angular';
import { TableModule, UtilitiesModule } from '@coreui/angular';
import { InputGroupComponent } from '@coreui/angular';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { initAutoTable } from 'src/utils/autoTable';



interface MilestoneData {
  milestoneTitle?: string;
  milestoneScore?: number;
}

interface SectionData {
  sectionId: string;
  sectionTitle: string;
  sectionScore: number;
  highlightRed?: boolean;
  milestoneList: MilestoneData[];
}

@Component({
  selector: 'app-operators-grid.component',
  templateUrl: './operators-grid.component.html',
  styleUrls: ['./operators-grid.component.scss'],
  standalone: true,
  imports: [HttpClientModule, InputGroupComponent, CommonModule, JsonPipe, NgStyle, FormsModule, ModalModule, RowComponent, ColComponent, ReactiveFormsModule, RouterLink, PageItemDirective, PageLinkDirective, PaginationComponent, TableModule, UtilitiesModule],
})

export class OperatorsGridComponent implements OnInit, OnDestroy {
  @ViewChild('newOperatorForm') newOperatorForm!: NgForm;
  @ViewChild('editOperatorForm') editOperatorForm!: NgForm;
  operators: any[] = [];
  filteredOperators: any[] = [];
  searchTerm: string = '';
  loggedInCompanyId!: string;
  //companyId?: string = '';
  private companyIdSubscription: Subscription | null = null;
  private unsubscribe$ = new Subject<void>();
  roles = CONSTANT.ROLES;
  roleKeys = CONSTANT.ROLES_KEY;
  selectedOperator: Operator | null = null;
  editedOperator: Operator | null = null;
  editModalVisible = false;
  addModalVisible = false;
  deleteModalVisible = false;
  //newOperatorForm: FormGroup;
  operatorToDelete: Operator | null = null;
  showNoOperatorsModal = false;
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalItems: number = 0;
  totalPages: number = 3;
  activePage: number = 1;

  jsonData: SectionData[] = [
    {
      sectionId: '95c11888-696c-4c2e-8e0e-c30aefa971e8',
      sectionTitle: 'Development Milestones',
      sectionScore: 11,
      highlightRed: true,
      milestoneList: [
        {
          milestoneTitle: 'Social/Emotional Milestones',
          milestoneScore: 3,
        },
        {
          milestoneTitle: 'Language / Communication Milestones',
          milestoneScore: 3,
        },
        {
          milestoneTitle: 'Movement / Physical Development Milestones',
          milestoneScore: 5,
        },
      ],
    },
    {
      sectionId: 'f18f0099-5105-44fc-ab4b-b8121b77ec1f',
      sectionTitle: 'Edinburgh Postnatal Depression Scale (EPDS)',
      sectionScore: 30,
      milestoneList: [
        {
          milestoneScore: 30,
        },
      ],
    },
  ];


  constructor(private http: HttpClient, private router: Router, private companyService: CompanyService, private formBuilder: FormBuilder) {
    // this.companyId = '3';
    // this.newOperatorForm = this.formBuilder.group({
    //   companyId: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    //   name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
    //   phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    //   username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
    //   password: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
    //   role: ['', Validators.required]
    // });
    this.itemsPerPage = this.getItemsPerPageFromStorage();
  }


  ngOnInit() {
    const loggedInCompanyId = sessionStorage.getItem('loggedInCompanyId');
    if (loggedInCompanyId) {
      this.loggedInCompanyId = loggedInCompanyId;
      console.log('Company ID after browser refresh:', this.loggedInCompanyId);
      this.fetchOperatorsData(this.loggedInCompanyId);
    } else {
      this.companyIdSubscription = this.companyService.companyId$.subscribe(
        (companyId: string) => {
          this.loggedInCompanyId = companyId;
          sessionStorage.setItem('loggedInCompanyId', companyId);
          this.fetchOperatorsData(companyId);
        }
      );
    }
    this.filterOperators();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.companyIdSubscription) {
      this.companyIdSubscription.unsubscribe();
    }
    localStorage.removeItem(CONSTANT.OPERATORS_DATA_KEY);
    sessionStorage.removeItem('loggedInCompanyId');
  }

  async generatePDF() {
    const doc = new jsPDF();
  
    // dynamically importing & initializing autoTable
    const autoTable = await initAutoTable();
  
    // converting JSON Data to a table format
    const tableData = this.jsonData.flatMap((section) => {
      const sectionRow = [
        section.sectionTitle || '',
        section.sectionScore.toString() || '',
        '', '',
      ];
  
      const milestoneRows = section.milestoneList.map((milestone) => [
        '', '', 
        milestone.milestoneTitle || '',
        milestone.milestoneScore?.toString() || '',
      ]);
  
      return [sectionRow, ...milestoneRows];
    });
  
    // table in the PDF using autoTable
    autoTable(doc, {
      head: [
        [
          { content: 'Section Title', rowSpan: 2 },
          { content: 'Section Score', rowSpan: 2 },
          { content: 'Milestone List', colSpan: 2 },
        ],
        [
          { content: 'Milestone Title' },
          { content: 'Milestone Score' },
        ],
      ],
      body: tableData,
      startY: 20,
      styles: {
        lineWidth: 0.1,
        lineColor: [200, 200, 200],
        cellPadding: 2, 
        halign: 'center', 
      },
      didParseCell: (data) => {
        // change font color if highlightRed is true for sectionScore logic
        if (data.section === 'body' && data.column.index === 1) {
          const rowIndex = data.row.index;
          let sectionIndex = 0;
          let cumulativeRowCount = 0;
          for (let i = 0; i < this.jsonData.length; i++) {
            const milestoneCount = this.jsonData[i].milestoneList.length;
            cumulativeRowCount += 1 + milestoneCount;
            if (rowIndex < cumulativeRowCount) {
              sectionIndex = i;
              break;
            }
          }
          const section = this.jsonData[sectionIndex];
          if (section.highlightRed) {
            data.cell.styles.textColor = [255, 0, 0]; 
          }
        }
      },
      didDrawCell: (data) => {
        // borders
        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
      },
    });
  
    doc.setProperties({
      title: 'Table PDF',
      creator: 'Your Application',
    });
  
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  }
  
  

  handlePageChange(page: number): void {
    this.currentPage = page;
    this.filterOperators();
  }

  generateArray(length: number): number[] {
    return Array.from({ length }, (_, i) => i + 1);
  }

  handleItemsPerPageChange(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    sessionStorage.setItem('itemsPerPage', itemsPerPage.toString());
    this.currentPage = 1;
    this.filterOperators();
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getItemsPerPageFromStorage(): number {
    const storedItemsPerPage = sessionStorage.getItem('itemsPerPage');
    return storedItemsPerPage ? parseInt(storedItemsPerPage, 10) : 3;
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      if (this.operators.length >= (i - 1) * this.itemsPerPage) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  }

  filterOperators() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
  
    const filteredBySearch = this.operators.filter((operator) =>
      operator.operatorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      operator.contactInfo.phone.includes(this.searchTerm) ||
      operator.credentials.username.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  
    this.filteredOperators = filteredBySearch.slice(startIndex, endIndex);
  
    this.totalItems = filteredBySearch.length;
  }


  fetchOperatorsData(companyId: string) {
    const apiUrl = `${CONSTANT.API_OPERATOR_URL}/${companyId}`;
    console.log(`Making API call to ${apiUrl}`);

    this.http
      .get<Operator[]>(apiUrl)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (response) => {
          console.log('API response:', response);
          const mappedOperators = mapOperatorData(response, companyId);
          console.log('Mapped operators:', mappedOperators);
          localStorage.setItem(CONSTANT.OPERATORS_DATA_KEY, JSON.stringify(mappedOperators));
          this.operators = mappedOperators;
          this.filterOperators();
          if (this.operators.length === 0) {
            this.showNoOperatorsModal = true;
          }
        },
        (error) => {
          console.error(CONSTANT.ERROR_FETCHING_OPERATORS, error);
        }
      );
  }

  getOperatorRoles(operator: Operator): string {
    return getOperatorRoles(operator);
  }

  openAddOperatorModal() {
    this.newOperatorForm;
    this.addModalVisible = true;
  }

  addNewOperator() {
    console.log('addNewOperator method called');

    const formValue = this.newOperatorForm.value;
    console.log('New operator form value:', formValue);

    const newOperator = {
      companyId: this.loggedInCompanyId,
      id: null,
      name: formValue.operatorName || '',
      password: formValue.password ? formValue.password : '',
      phone: formValue.contactInfo ? formValue.contactInfo.phone : '',
      username: formValue.username ? formValue.username : '',
      ...formValue,
      role1: false,
      role2: false,
      role3: false,
    };

    if (formValue.role === 'role1') {
      newOperator.role1 = true;
    } else if (formValue.role === 'role2') {
      newOperator.role2 = true;
    } else if (formValue.role === 'role3') {
      newOperator.role3 = true;
    }


    const selectedRole = newOperator.role;
    const apiUrl = `http://localhost:5000/api/operator`;

    console.log('Sending POST request to:', apiUrl);
    console.log('Request body:', newOperator);

    this.http
      .post<Operator>(apiUrl, newOperator)
      // .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (response) => {
          console.log('New operator added:', response);
          this.fetchOperatorsData(this.loggedInCompanyId);
          // const mappedOperator = {
          //   companyId: this.loggedInCompanyId,
          //   id: response._id,
          //   name: newOperator.name,
          //   password: newOperator.password,
          //   phone: newOperator.phone,
          //   role1: newOperator.role1,
          //   role2: newOperator.role2,
          //   role3: newOperator.role3,
          //   username: newOperator.username
          // };
          // this.operators.push(mappedOperator);
          // localStorage.setItem(CONSTANT.OPERATORS_DATA_KEY, JSON.stringify(this.operators));
          this.newOperatorForm.reset();
        },
        (error) => {
          console.error('Error adding new operator:', error);
        }
      );
  }


  openDeleteOperatorModal(operator: Operator) {
    this.operatorToDelete = operator;
    this.deleteModalVisible = true;
  }

  deleteOperator(operator: Operator) {

    const apiUrl = `http://localhost:5000/api/operator/${operator.operatorId}`;
    console.log(`Sending DELETE request to ${apiUrl}`);

    this.http
      .delete(apiUrl)
      // .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (response) => {
          console.log('DELETE response:', response);
          this.fetchOperatorsData(this.loggedInCompanyId);
          // const updatedOperators = this.operators.filter(op => op.id !== operator._id);
          // console.log('Updated operators list:', updatedOperators);
          // this.operators = updatedOperators;
          // localStorage.setItem(CONSTANT.OPERATORS_DATA_KEY, JSON.stringify(this.operators));
          // console.log('Operators data saved to localStorage');

        },
        (error) => {
          console.error('Error deleting operator:', error);
        }
      );
  }

  openEditOperatorModal(operator: Operator) {
    console.log('openEditOperatorModal called with operator:', operator);
    this.editedOperator = { ...operator };
    this.editModalVisible = true;

    setTimeout(() => {
      console.log('Setting form values in setTimeout');
      this.editOperatorForm.setValue({
        operatorId: operator._id,
        operatorName: operator.name,
        contactInfo: { phone: operator.phone },
        credentials: { username: operator.username },
        password: operator.password,
        role: operator.role1 ? 'role1' : operator.role2 ? 'role2' : 'role3'
      });
    }, 0);
  }



  editOperator(operator: Operator) {
    console.log('editOperator method called');
    const formValue = this.editOperatorForm.value;
    console.log('Edit operator form value:', formValue);

    const editedOperator = {
      name: formValue.operatorName,
      phone: formValue.contactInfo ? formValue.contactInfo.phone : operator.phone,
      username: formValue.username ? formValue.username : operator.username,
      ...formValue,
      role1: operator.role1,
      role2: operator.role2,
      role3: operator.role3,
    };

    if (formValue.role === 'role1') {
      editedOperator.role1 = true;
      editedOperator.role2 = false;
      editedOperator.role3 = false;
    } else if (formValue.role === 'role2') {
      editedOperator.role1 = false;
      editedOperator.role2 = true;
      editedOperator.role3 = false;
    } else if (formValue.role === 'role3') {
      editedOperator.role1 = false;
      editedOperator.role2 = false;
      editedOperator.role3 = true;
    }

    const selectedRole = editedOperator.role;
    const apiUrl = `http://localhost:5000/api/operator/${operator.operatorId}`;
    console.log('Sending PUT request to:', apiUrl);
    console.log('Request body:', editedOperator);

    this.http
      .put<Operator>(apiUrl, editedOperator)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (response) => {
          console.log('Operator updated:', response);
          this.fetchOperatorsData(this.loggedInCompanyId);
          // const updatedOperators = this.operators.map((op) =>
          //   op._id === response._id ? { ...response } : op
          // );
          // this.operators = updatedOperators;
          // localStorage.setItem(CONSTANT.OPERATORS_DATA_KEY, JSON.stringify(this.operators));
          this.editOperatorForm.reset();
        },
        (error) => {
          console.error('Error updating operator:', error);
        }
      );
  }
}