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
import { CompanyService } from 'src/utils/company.service';
import { getOperatorRoles } from 'src/utils/operators.service';

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
    private companyService: CompanyService,
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.pattern(CONSTANT.passwordPattern)]],
    });
  }

  handleSuccessfulLogin(message: string, userRole: string, navRoute: string, token: string, response: any) {
    this.successMessage = message;
    this.userService.setUserRole(userRole);
    
    if (userRole === CONSTANT.COMPANY) {
      const companyId = response.companyId; // Assuming the company ID is in the response
      this.companyService.setCompanyId(companyId);
      const companyName = response.name; 
      this.userService.setCompanyName(companyName); // For company users
    } else {
      this.userService.setCompanyName(''); // For non-company users
    }

    if (userRole === CONSTANT.OPERATOR) {
      const operatorRoles = getOperatorRoles(response);
      const operatorName = response.name;
      
      this.userService.setOperatorName(operatorName);
      this.userService.setOperatorRole(operatorRoles);
    }

    // if (response.role1) {
    //   navRoute = '/operator/inwards';
    // } else if (response.role2) {
    //   navRoute = '/operator/compare';
    // } else if (response.role3) {
    //   navRoute = '/operator/outwards';
    // }
  
    this.router.navigate(['/dashboard']);
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
            this.handleSuccessfulLogin(CONSTANT.LOGIN_SUCCESSFUL, CONSTANT.SUPERADMIN, 'SUPERADMIN', response.token, response)
          } else if (response.isCompany) {
            // Company login
            console.log(CONSTANT.COMPANY_LOGGED_IN, response);
            this.handleSuccessfulLogin(CONSTANT.LOGIN_SUCCESSFUL, CONSTANT.COMPANY, 'COMPANY', response.token, response)
          } else if (response.isOperator) {
            // Operator login
            console.log(CONSTANT.OPERATOR_LOGGED_IN, response);
            this.handleSuccessfulLogin(CONSTANT.LOGIN_SUCCESSFUL, CONSTANT.OPERATOR, response.role, response.token, response)
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

