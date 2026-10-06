import {Component, OnInit, ViewEncapsulation, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ROLE_NAME, RoleName} from "../../../entities/enum/rolename";
import {AuthActions} from "../../../store/auth/auth.actions";
import {Store} from "@ngrx/store";
import {ConfirmationService} from "primeng/api";
import {AuthService} from "../../../service/auth.service";
import {selectLogin} from "../../../store/auth/auth.selectors";
import {User} from "../../../entities/user";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-navigation-links',
    templateUrl: './navigation-links.component.html',
    styleUrls: ['./navigation-links.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [RouterLink, RouterLinkActive, TranslatePipe]
})
export class NavigationLinksComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);


  protected readonly ROLE_NAME = ROLE_NAME;
  userRoles: RoleName[] = [];
  userIsLoggedIn = false;
  userLoggedIn: User | undefined;

  constructor(private store: Store, private authService: AuthService) {

  }

  ngOnInit(): void {
    this.store.select(selectLogin).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
      this.userLoggedIn = user != null ? user : undefined;
      this.userIsLoggedIn = user != null;
      this.userRoles = [...this.authService.getAllRolesOfLoggedInUser()];
    });
  }

  hasRole(roleName: RoleName) {
    return this.userRoles.filter(role => role === roleName).length > 0
  }
}
