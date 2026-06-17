import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {User} from "../entities/user";
import {catchError} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {HttpErrorHandlerService} from "./http-error-handler.service";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private api = `${environment.webserviceurl}`;

  constructor(private httpClient: HttpClient, private httpErrorHandler: HttpErrorHandlerService) {
  }

  saveProfile(user: User) {
    return this.httpClient.post<undefined>(`${this.api}/profil`, user).pipe(
      catchError(error => this.httpErrorHandler.handleWithSummary(error, `Fehler beim Speichern! ${error.message}`))
    );
  }
}
