import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthResolver implements Resolve<boolean> {
  constructor(private router: Router, private authService: AuthService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      switchMap(() => {
        const isAuthenticated = this.authService.checkAuthStatus();
        console.log('AuthResolver: Is authenticated:', isAuthenticated);
        console.log('AuthResolver: Current URL:', state.url);
        if (isAuthenticated) {
          console.log('AuthResolver: User is authenticated');
          return of(true);
        } else {
          console.log('AuthResolver: User is not authenticated, redirecting to login');
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return of(false);
        }
      })
    );
  }
}