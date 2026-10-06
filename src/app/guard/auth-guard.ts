import {Injectable} from '@angular/core';
import {AuthService} from "../service/auth.service";
import {Router, UrlTree} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private router: Router, private loginService: AuthService) {
  }

  canActivate(): boolean | UrlTree {
    return this.loginService.isLoginStateValid() || this.router.createUrlTree(['/login']);
  }
}
