import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Subscription } from 'rxjs';
import { CompanyService } from 'src/utils/company.service';
import { CONSTANT } from 'src/constants/constants';
import { mapOperatorData, getOperatorRoles } from 'src/utils/operators.service';
import { Role, Operator } from 'src/utils/models';

@Component({
  selector: 'app-operators-grid.component',
  templateUrl: './operators-grid.component.html',
  styleUrls: ['./operators-grid.component.scss'],
  standalone: true,
  imports: [HttpClientModule, CommonModule, JsonPipe, NgStyle, FormsModule],
})

export class OperatorsGridComponent implements OnInit, OnDestroy {
  @ViewChild('newOperatorForm') newOperatorForm!: NgForm;
  @ViewChild('editOperatorForm') editOperatorForm!: NgForm;
  operators: any[] = [];
  loggedInCompanyId!: string;
  //companyId?: string = '';
  private companyIdSubscription: Subscription | null = null;
  private unsubscribe$ = new Subject<void>();
  roles = CONSTANT.ROLES;
  roleKeys = CONSTANT.ROLES_KEY;
  selectedOperator: Operator | null = null;
  editedOperator: Operator | null = null;

  constructor(private http: HttpClient, private router: Router, private companyService: CompanyService) {
    // this.companyId = '3';
  }

  ngOnInit() {
    this.companyIdSubscription = this.companyService.companyId$.subscribe(
      (companyId: string) => {
        this.loggedInCompanyId = companyId;

        const storedOperatorsData = localStorage.getItem(CONSTANT.OPERATORS_DATA_KEY);
        if (storedOperatorsData) {
          this.operators = JSON.parse(storedOperatorsData);
        } else {
          this.fetchOperatorsData(companyId);
        }
      }
    );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.companyIdSubscription) {
      this.companyIdSubscription.unsubscribe();
    }
    localStorage.removeItem(CONSTANT.OPERATORS_DATA_KEY);
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
        },
        (error) => {
          console.error(CONSTANT.ERROR_FETCHING_OPERATORS, error);
        }
      );
  }

  getOperatorRoles(operator: Operator): string {
    return getOperatorRoles(operator);
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
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (response) => {
          console.log('New operator added:', response);
          const mappedOperator = {
            companyId: this.loggedInCompanyId,
            id: response._id,
            name: newOperator.name,
            password: newOperator.password,
            phone: newOperator.phone,
            role1: newOperator.role1,
            role2: newOperator.role2,
            role3: newOperator.role3,
            username: newOperator.username
          };
          this.operators.push(mappedOperator);
          localStorage.setItem(CONSTANT.OPERATORS_DATA_KEY, JSON.stringify(this.operators));
          this.newOperatorForm.reset();
        },
        (error) => {
          console.error('Error adding new operator:', error);
        }
      );
  }

  deleteOperator(operator: Operator) {
    const confirmDelete = confirm(`Are you sure you want to delete this operator?`);

    if (confirmDelete) {
      const apiUrl = `http://localhost:5000/api/operator/${operator.operatorId}`;
      console.log(`Sending DELETE request to ${apiUrl}`);

      this.http
        .delete(apiUrl)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (response) => {
            console.log('DELETE response:', response);
            const updatedOperators = this.operators.filter(op => op.id !== operator._id);
            console.log('Updated operators list:', updatedOperators);
            this.operators = updatedOperators;
            localStorage.setItem(CONSTANT.OPERATORS_DATA_KEY, JSON.stringify(this.operators));
            console.log('Operators data saved to localStorage');
          },
          (error) => {
            console.error('Error deleting operator:', error);
          }
        );
    }
  }

  saveUpdatedOperator() {
    if (this.editedOperator) {
      const formValue = this.editOperatorForm.value;
      console.log('Updated operator form value:', formValue);
      const updatedOperator = {
        companyId: this.loggedInCompanyId,
        id: this.editedOperator._id,
        name: formValue.name || this.editedOperator.name,
        password: formValue.password ? formValue.password : this.editedOperator.password,
        phone: formValue.phone || this.editedOperator.phone,
        username: formValue.username || this.editedOperator.username,
        role1: formValue.role === 'role1',
        role2: formValue.role === 'role2',
        role3: formValue.role === 'role3',
      };
      const apiUrl = `http://localhost:5000/api/operator/${updatedOperator.id}`;
      console.log(`Sending PUT request to ${apiUrl}`);
      console.log('Request body:', updatedOperator);
      this.http
        .put(apiUrl, updatedOperator)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (response) => {
            console.log('PUT response:', response);
            const updatedOperators = this.operators.map(op => (op.id === updatedOperator.id ? updatedOperator : op));
            console.log('Updated operators list:', updatedOperators);
            this.operators = updatedOperators;
            localStorage.setItem(CONSTANT.OPERATORS_DATA_KEY, JSON.stringify(this.operators));
            console.log('Operators data saved to localStorage');
            this.editedOperator = null; // Reset the edited operator
          },
          (error) => {
            console.error('Error updating operator:', error);
          }
        );
    }
  }
}