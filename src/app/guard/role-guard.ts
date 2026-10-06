import {Injectable} from '@angular/core';
import {AuthService} from "../service/auth.service";
import {ActivatedRouteSnapshot, Router, UrlTree} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {

  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (!this.authService.isLoginStateValid()) {
      return this.router.createUrlTree(['/login']);
    }

    const hasExpectedRole = this.authService.getAllRolesOfLoggedInUser()
      .some(role => role === route.data['expectedRole']);

    return hasExpectedRole || this.router.createUrlTree(['/home']);
  }
}
