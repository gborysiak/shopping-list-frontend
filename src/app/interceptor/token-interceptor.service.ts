import {inject} from '@angular/core';
import {HttpInterceptorFn} from '@angular/common/http';
import {throwError} from 'rxjs';
import {Router} from "@angular/router";
import {AuthService} from "../service/auth.service";
import {environment} from "../../environments/environment";

const publicAuthUrls = [
  '/User/login',
  '/User/subscribe',
  '/auth/confirm',
  '/auth/refresh-token'
];

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isApiRequest = request.url.startsWith(environment.webserviceurl);
  const isPublicAuthRequest = publicAuthUrls.some(publicUrl => request.url.includes(publicUrl));

  if (!isApiRequest || isPublicAuthRequest) {
    return next(request);
  }

  const token = auth.getActiveLoginToken();

  if (!token || !auth.isLoginStateValid()) {
    router.navigateByUrl('/login');
    return throwError(() => new Error('Token nicht mehr valide!'));
  }

  return next(request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }));
};
