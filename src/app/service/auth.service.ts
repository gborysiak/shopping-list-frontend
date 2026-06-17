import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../entities/user";
import {catchError} from "rxjs/operators";
import {Store} from "@ngrx/store";
import jwtDecode, {JwtPayload} from 'jwt-decode';
import {environment} from "../../environments/environment";
import {ROLE_NAME, RoleName} from "../entities/enum/rolename";
import {AuthActions} from "../store/auth/auth.actions";
import {HttpErrorHandlerService} from "./http-error-handler.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'user';
  private api = `${environment.webserviceurl}`;

  constructor(private httpClient: HttpClient, private store: Store, private httpErrorHandler: HttpErrorHandlerService) {
  }

  login(user: User) {
    return this.httpClient.post<User>(`${this.api}/User/login`, user).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }

  register(user: User) {
    return this.httpClient.post<User>(`${this.api}/User/subscribe`, user).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }

  confirmRegistrationToken(token: string) {
    return this.httpClient.post<string>(`${this.api}/auth/confirm?token=${token}`, token).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }

  refreshToken(token: string) {
    return this.httpClient.post<any>(`${this.api}/auth/refresh-token`, token).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }

  saveLoginStateToLocalStorage(user: User | null) {
    if (user) {
      localStorage.setItem(this.storageKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.storageKey);
    }
  }

  getActiveLoginToken(): string {
    return this.getStoredUser()?.token ?? '';
  }

  isLoginStateValid(): boolean {
    const user = this.getStoredUser();

    if (user?.token && this.isTokenNotExpired(this.getExpire(user.token))) {
      this.store.dispatch(AuthActions.loginLocalstorage({data: user}));
      return true;
    }

    this.saveLoginStateToLocalStorage(null);
    return false;
  }

  getAllRolesOfLoggedInUser(): RoleName[] {
    const roles = this.getStoredUser()?.roles ?? [];

    return roles.flatMap(role => {
      const roleName = Object.values(ROLE_NAME).find(value => role.name === value);
      return roleName ? [roleName] : [];
    });
  }

  private getStoredUser(): User | null {
    const userString = localStorage.getItem(this.storageKey);

    if (!userString) {
      return null;
    }

    try {
      return JSON.parse(userString) as User;
    } catch {
      this.saveLoginStateToLocalStorage(null);
      return null;
    }
  }

  private getExpire(token: string): Date | undefined {
    try {
      const params: JwtPayload = jwtDecode(token);
      return params.exp ? new Date(params.exp * 1000) : undefined;
    } catch {
      return undefined;
    }
  }

  private isTokenNotExpired(expire: Date | string | undefined): boolean {
    const date: Date | undefined = this.getDateOrStringAsDate(expire);
    return date !== undefined && date.getTime() > new Date().getTime();
  }

  private getDateOrStringAsDate(dateOrString: string | Date | undefined): Date | undefined {
    if (typeof dateOrString === 'string') {
      return new Date(dateOrString);
    } else if (dateOrString) {
      return dateOrString;
    } else {
      return undefined;
    }
  }
}
