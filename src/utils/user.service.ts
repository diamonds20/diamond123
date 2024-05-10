import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
//import { UserDataService } from 'src/utils/user-data.service'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // constructor(private userDataService: UserDataService) {}
  private userRoleSubject = new BehaviorSubject<string>('');
  public userRole$ = this.userRoleSubject.asObservable();

  private companyNameSubject = new BehaviorSubject<string>('');
  public companyName$ = this.companyNameSubject.asObservable();

  setUserRole(role: string) {
    this.userRoleSubject.next(role);
  }

  setCompanyName(name: string) {
    this.companyNameSubject.next(name);
    console.log(name); // You can remove this line if you don't need to log the company name
  }

  getUserRole(): string {
    return this.userRoleSubject.getValue();
  }

  getCompanyName(): string {
    return this.companyNameSubject.getValue();
  }

  // getLoggedInCompanyId(): string {
  //   const loggedInUser = this.userDataService.getLoggedInUser();
  //   return loggedInUser ? loggedInUser.companyId : '2';
  // }
}