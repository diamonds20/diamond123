import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userRole: string = '';
  private companyName: string = '';

  setUserRole(role: string) {
    this.userRole = role;
  }

  setCompanyName(name: string) {
    this.companyName = name;
    (console.log(this.companyName))
  }

  getUserRole(): string {
    return this.userRole;
  }

  getCompanyName(): string {
    return this.companyName;
  }
}