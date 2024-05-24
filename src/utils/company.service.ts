import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private _companyId = new BehaviorSubject<string>('');
  public companyId$ = this._companyId.asObservable();

  setCompanyId(companyId: string) {
    console.log('Setting companyId:', companyId);
    this._companyId.next(companyId);
  }
}