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
  operators: any[] = [];
  loggedInCompanyId!: string;
  //companyId?: string = '';
  private companyIdSubscription: Subscription | null = null;
  private unsubscribe$ = new Subject<void>();
  roles = CONSTANT.ROLES;
  roleKeys = CONSTANT.ROLES_KEY;

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
    const newOperator = this.newOperatorForm.value;
    const selectedRole = newOperator.role;
   
    const apiUrl = `${CONSTANT.API_OPERATOR_URL}/${this.loggedInCompanyId}`;
    this.http
      .post<Operator>(apiUrl, newOperator)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (response) => {
          console.log('New operator added:', response);
          const mappedOperator = mapOperatorData([response], this.loggedInCompanyId)[0];
          this.operators.push(mappedOperator);
          localStorage.setItem(CONSTANT.OPERATORS_DATA_KEY, JSON.stringify(this.operators));
          this.newOperatorForm.reset();
        },
        (error) => {
          console.error('Error adding new operator:', error);
        }
      );
  }
}