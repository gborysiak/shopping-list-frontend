import {Injectable} from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {User} from "../entities/user";
import {catchError} from "rxjs/operators";
import {Store} from "@ngrx/store";
import jwtDecode, {JwtPayload} from 'jwt-decode';
import {MessageService} from "primeng/api";
import {environment} from "../../environments/environment";
import {ROLE_NAME, RoleName} from "../entities/enum/rolename";
import {AuthActions} from "../store/auth/auth.actions";
import {selectLogin} from "../store/auth/auth.selectors";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private api = `${environment.webserviceurl}`;

  constructor(private httpClient: HttpClient, private store: Store, private messageService: MessageService) {
  }

  private errorHandler(error: HttpErrorResponse): Observable<never> {
    console.error('Fehler aufgetreten!' + JSON.stringify(error));
    this.messageService.add({severity: 'error', summary: `Fehler beim Speichern! ${error.message}`});
    return throwError(() => error);
  }

  saveProfile(user: User) {
    return this.httpClient.post<undefined>(`${this.api}/profil`, user).pipe(
      catchError(error => this.errorHandler(error))
    );
  }
}
