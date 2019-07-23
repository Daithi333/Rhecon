import { Injectable, OnDestroy } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor, OnDestroy {
  private tokenSub: Subscription;

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.tokenSub = this.authService.token.subscribe(token => {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    });
    return next.handle(request);
  }

  ngOnDestroy() {
    if (this.tokenSub) {
      this.tokenSub.unsubscribe();
    }
  }

}
