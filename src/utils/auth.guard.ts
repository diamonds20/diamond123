import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      switchMap(isAuthenticated => {
        const currentStatus = this.authService.checkAuthStatus();
        console.log('AuthGuard: Is authenticated:', currentStatus);
        if (currentStatus) {
          return of(true);
        } else {
          console.log('AuthGuard: Unauthenticated user, redirecting to login');
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return of(false);
        }
      })
    );
  }
}