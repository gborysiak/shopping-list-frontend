import {inject} from '@angular/core';
import {CanActivateFn, Router} from "@angular/router";
import {AuthService} from "../service/auth.service";

export const authGuard: CanActivateFn = () => {
  return inject(AuthService).isLoginStateValid() || inject(Router).createUrlTree(['/login']);
};
