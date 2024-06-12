import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/utils/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CONSTANT } from 'src/constants/constants';


@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.scss'
})
export class CompareComponent implements OnInit, OnDestroy {
  operatorName: string = '';
  operatorRole: string = '';
  isCompareRoute: boolean = false;

  constructor(private userService: UserService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.operatorName = sessionStorage.getItem(CONSTANT.OPERATOR_NAME_KEY) || '';
    this.operatorRole = sessionStorage.getItem(CONSTANT.OPERATOR_ROLE_KEY) || '';

    // If not found in session storage, get from UserService
    if (!this.operatorName || !this.operatorRole) {
      this.operatorName = this.userService.getOperatorName();
      this.operatorRole = this.userService.getOperatorRole();

      sessionStorage.setItem(CONSTANT.OPERATOR_NAME_KEY, this.operatorName);
      sessionStorage.setItem(CONSTANT.OPERATOR_ROLE_KEY, this.operatorRole);
    }
    console.log(`${CONSTANT.RETRIEVED_OPERATOR_NAME}: ${this.operatorName}`);
    
     this.isCompareRoute = this.router.url.includes(CONSTANT.COMPARE_PATH);

     if (this.isCompareRoute) {
       console.log(`${CONSTANT.RETRIEVED_OPERATOR_ROLE}:${CONSTANT.ROLE2}`);
     } else {
       console.log(`${CONSTANT.RETRIEVED_OPERATOR_ROLE}: ${this.operatorRole}`);
     }
  }

  ngOnDestroy(): void {
    // Remove session storage item
    sessionStorage.removeItem(CONSTANT.OPERATOR_NAME_KEY);
    sessionStorage.removeItem(CONSTANT.OPERATOR_ROLE_KEY);
  }
}
