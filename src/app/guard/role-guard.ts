import {inject} from '@angular/core';
import {CanActivateFn, Router} from "@angular/router";
import {AuthService} from "../service/auth.service";

export const roleGuard: CanActivateFn = route => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoginStateValid()) {
    return router.createUrlTree(['/login']);
  }

  const hasExpectedRole = authService.getAllRolesOfLoggedInUser()
    .some(role => role === route.data['expectedRole']);

  return hasExpectedRole || router.createUrlTree(['/home']);
};
