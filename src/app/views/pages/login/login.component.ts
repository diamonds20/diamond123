import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastModule } from '@coreui/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, JsonPipe } from '@angular/common';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective, FormModule } from '@coreui/angular';
import { setToken } from 'src/utils/utils';
import { UserService } from 'src/utils/user.service';
import {
  API_BASE_URL,
  LOGIN_SUCCESSFUL,
  LOGIN_ERROR,
  SUPER_ADMIN_LOGGED_IN,
  COMPANY_LOGGED_IN,
  OPERATOR_LOGGED_IN,
  ERROR_LOGIN,
  DASHBOARD_ROUTE,
  SUPERADMIN,
  COMPANY,
  OPERATOR,
  FAILURE_WHILE_LOGIN,
  passwordPattern
} from 'src/constants/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormModule, HttpClientModule, ToastModule, CommonModule, JsonPipe, ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle
  ],
})

export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';
  userRole: String = '';
  successMessage: string = '';
  isLoginClicked: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.pattern(passwordPattern)]],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoginClicked = true;
      const { username, password } = this.loginForm.value;
      const credentials = { username, password };
      this.http.post(`${API_BASE_URL}`, credentials).subscribe(
        (response: any) => {
          if (response.isSuperAdmin) {
            // SuperAdmin login
            console.log(SUPER_ADMIN_LOGGED_IN, response);
            this.successMessage = LOGIN_SUCCESSFUL;
            this.userRole = SUPERADMIN;
            this.userService.setUserRole(SUPERADMIN);
            this.router.navigateByUrl(DASHBOARD_ROUTE);
          } else if (response.isCompany) {
            // Company login
            console.log(COMPANY_LOGGED_IN, response);
            setToken(response.token);
            this.successMessage = LOGIN_SUCCESSFUL;
            this.userRole = COMPANY;
            this.userService.setUserRole(COMPANY);
            this.router.navigateByUrl(DASHBOARD_ROUTE);
          } else if (response.isOperator) {
            // Operator login
            console.log(OPERATOR_LOGGED_IN, response);
            setToken(response.token);
            this.successMessage = LOGIN_SUCCESSFUL;
            this.userRole = OPERATOR;
            this.userService.setUserRole(OPERATOR);
            this.router.navigateByUrl(DASHBOARD_ROUTE);
          } else {
            this.error =  FAILURE_WHILE_LOGIN;
          }
        },
        (error) => {
          if (error.status === 401) {
            this.error =  FAILURE_WHILE_LOGIN;
          } else {
            console.error(ERROR_LOGIN, error);
            this.error = LOGIN_ERROR;
          }
        }
      );
    }
  }
}

