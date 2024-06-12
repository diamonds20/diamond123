import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
//import { UserDataService } from 'src/utils/user-data.service'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userRole: string = '';
  private operatorName: string = '';
  private operatorRole: string = '';
  // constructor(private userDataService: UserDataService) {}
  private userRoleSubject = new BehaviorSubject<string>('');
  public userRole$ = this.userRoleSubject.asObservable();

  private operatorRoleSubject = new BehaviorSubject<string>('');
  public operatorRole$ = this.operatorRoleSubject.asObservable();

  private companyNameSubject = new BehaviorSubject<string>('');
  public companyName$ = this.companyNameSubject.asObservable();

  setUserRole(role: string) {
    this.userRoleSubject.next(role);
  }

  getUserRole(): string {
    return this.userRoleSubject.getValue();
  }

  setCompanyName(name: string) {
    this.companyNameSubject.next(name);
    console.log(name); // You can remove this line if you don't need to log the company name
  }

  getCompanyName(): string {
    return this.companyNameSubject.getValue();
  }

  setOperatorRole(role: string) {
    this.operatorRoleSubject.next(role);
    console.log(role);
  }

  getOperatorRole() {
    return this.operatorRoleSubject.getValue();
  }

  getOperatorName() {
    return this.operatorName;
  }

  setOperatorName(name: string) {
    this.operatorName = name;
  }

  

 

  // getLoggedInCompanyId(): string {
  //   const loggedInUser = this.userDataService.getLoggedInUser();
  //   return loggedInUser ? loggedInUser.companyId : '2';
  // }
}