import { Injectable } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { BehaviorSubject, Observable } from 'rxjs'; 

@Injectable({ providedIn: 'root' }) 

export class AuthService { 
  private isAuthenticatedSource = new BehaviorSubject<boolean>(false); 
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSource.asObservable(); 
  
  constructor(private router: Router) { 
    this.checkAuthStatus(); 
  }

  checkAuthStatus() { 
    const token = localStorage.getItem('authToken'); 
    const isAuthenticated = !!token; 
    this.isAuthenticatedSource.next(isAuthenticated); 
    return isAuthenticated; 
  } 
  
  login() { 
    localStorage.setItem('authToken', 'true'); 
    this.isAuthenticatedSource.next(true); 
    this.router.navigate(['/dashboard']); 
  } 
  
  logout() { 
    localStorage.removeItem('authToken'); 
    this.isAuthenticatedSource.next(false); 
    this.router.navigate(['/login']); 
  } 
  
  isLoggedIn(): boolean { 
    return this.checkAuthStatus(); 
  } 
}