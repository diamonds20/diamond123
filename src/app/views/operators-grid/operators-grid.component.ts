import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, JsonPipe } from '@angular/common';
import { NgStyle } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Subscription } from 'rxjs';
import { CompanyService } from 'src/utils/company.service';

interface Role {
  type: string;
}

export interface Operator {
  name: string;
  username: string;
  phone: string;
  roles: Role[];
  companyId: string;
  role1: boolean;
  role2: boolean;
  role3: boolean;
}

@Component({
  selector: 'app-operators-grid.component',
  templateUrl: './operators-grid.component.html',
  styleUrls: ['./operators-grid.component.scss'],
  standalone: true,
  imports: [HttpClientModule, CommonModule, JsonPipe, NgStyle],
})

export class OperatorsGridComponent implements OnInit, OnDestroy {
  operators: any[] = [];
  loggedInCompanyId?: string;
  companyId?: string = '';
  private companyIdSubscription: Subscription | null = null;
  private unsubscribe$ = new Subject<void>();
  roles = ['Role 1', 'Role 2', 'Role 3'];
  roleKeys = ['role1', 'role2', 'role3'];

  constructor(private http: HttpClient, private router: Router, private companyService: CompanyService) {
    // this.companyId = '3';
  }

  ngOnInit() {
    this.companyIdSubscription = this.companyService.companyId$.subscribe(
      (companyId: string) => {
        this.loggedInCompanyId = companyId;

        const storedOperatorsData = localStorage.getItem('operatorsData');
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
    localStorage.removeItem('operatorsData');
  }

  fetchOperatorsData(companyId: string) {
    const apiUrl = `http://localhost:5000/api/operators/${companyId}`;
    console.log(`Making API call to ${apiUrl}`);

    this.http
      .get<Operator[]>(apiUrl)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (response) => {
          console.log('API response:', response);
          const mappedOperators = response
            .filter(operator => operator.companyId === companyId)
            .map(operator => ({
              operatorName: operator.name,
              credentials: { username: operator.username },
              contactInfo: { phone: operator.phone },
              roles: {
                'Role 1': operator.role1 || false,
                'Role 2': operator.role2 || false,
                'Role 3': operator.role3 || false,
              }
            }));
          console.log('Mapped operators:', mappedOperators);
          localStorage.setItem('operatorsData', JSON.stringify(mappedOperators));
          this.operators = mappedOperators;
        },
        (error) => {
          console.error('Error fetching operator data:', error);
        }
      );
  }

  getOperatorRoles(operator: Operator): string {
    const operatorRoles: string[] = [];

    if (operator.role1) {
      operatorRoles.push(this.roles[0]);
    }

    if (operator.role2) {
      operatorRoles.push(this.roles[1]);
    }

    if (operator.role3) {
      operatorRoles.push(this.roles[2]);
    }

    return operatorRoles.join(', ');
  }
}