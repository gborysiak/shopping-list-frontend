import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from "../service/auth.service";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private readonly publicAuthUrls = [
    '/User/login',
    '/User/subscribe',
    '/auth/confirm',
    '/auth/refresh-token'
  ];

  constructor(private auth: AuthService, private router: Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isApiRequest(request.url) || this.isPublicAuthRequest(request.url)) {
      return next.handle(request);
    }

    const token = this.auth.getActiveLoginToken();

    if (!token || !this.auth.isLoginStateValid()) {
      this.router.navigateByUrl('/login');
      return throwError(() => new Error('Token nicht mehr valide!'));
    }

    return next.handle(request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    }));
  }

  private isApiRequest(url: string): boolean {
    return url.startsWith(environment.webserviceurl);
  }

  private isPublicAuthRequest(url: string): boolean {
    return this.publicAuthUrls.some(publicUrl => url.includes(publicUrl));
  }
}
