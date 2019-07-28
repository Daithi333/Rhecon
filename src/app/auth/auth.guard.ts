import { Injectable } from '@angular/core';
import { CanLoad, UrlSegment, Route, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService,
              private router: Router) {
}
  // protect routes from unauthenticated user
  canLoad(route: Route, segments: UrlSegment[]):
    Observable<boolean> | Promise<boolean> | boolean {
      return this.authService.isUserAuthenticated.pipe(
        take(1),
        switchMap(isAuthenticated => {
          if (!isAuthenticated) {
            // try auto-Login, such as on app reload
            return this.authService.autoLogin();
          } else {
            return of(isAuthenticated);
          }
        }),
        tap(isAuthenticated => {
          if (!isAuthenticated) {
            this.router.navigateByUrl('/auth');
          }
        })
      );
  }
}
