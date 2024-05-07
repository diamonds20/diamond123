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
import { CONSTANT } from 'src/constants/constants';

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
      password: ['', [Validators.required, Validators.minLength(3), Validators.pattern(CONSTANT.passwordPattern)]],
    });
  }

  handleSuccessfulLogin(message: string, userRole: string, navRoute: string, token: string, response: any) {
    this.successMessage = message;
    this.userRole = userRole;
    this.userService.setUserRole(userRole);
    
    if (userRole === CONSTANT.COMPANY) {
      const companyName = response.name; 
      this.userService.setCompanyName(companyName); // For company users
    } else {
      this.userService.setCompanyName(''); // For non-company users
    }
    
    this.router.navigateByUrl(navRoute);
    setToken(token);
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoginClicked = true;
      const { username, password } = this.loginForm.value;
      const reqData = { username, password };
      this.http.post(`${CONSTANT.API_BASE_URL}`, reqData).subscribe(
        (response: any) => {
          if (response.isSuperAdmin) {
            // SuperAdmin login
            console.log(CONSTANT.SUPER_ADMIN_LOGGED_IN, response);
            this.handleSuccessfulLogin(CONSTANT.LOGIN_SUCCESSFUL, CONSTANT.SUPERADMIN, CONSTANT.DASHBOARD_ROUTE, response.token, response)
          } else if (response.isCompany) {
            // Company login
            console.log(CONSTANT.COMPANY_LOGGED_IN, response);
            this.handleSuccessfulLogin(CONSTANT.LOGIN_SUCCESSFUL, CONSTANT.COMPANY, CONSTANT.DASHBOARD_ROUTE, response.token, response)
          } else if (response.isOperator) {
            // Operator login
            console.log(CONSTANT.OPERATOR_LOGGED_IN, response);
            this.handleSuccessfulLogin(CONSTANT.LOGIN_SUCCESSFUL, CONSTANT.OPERATOR, CONSTANT.DASHBOARD_ROUTE, response.token, response)
          } else {
            this.error = CONSTANT.FAILURE_WHILE_LOGIN;
          }
        },
        (error) => {
          if (error.status === 401) {
            this.error = CONSTANT.FAILURE_WHILE_LOGIN;
          } else {
            console.error(CONSTANT.ERROR_LOGIN, error);
            this.error = CONSTANT.LOGIN_ERROR;
          }
        }
      );
    }
  }
}

