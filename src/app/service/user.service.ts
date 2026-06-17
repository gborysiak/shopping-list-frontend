import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable, retry} from "rxjs";
import {environment} from "../../environments/environment";
import {User} from "../entities/user";
import {catchError} from "rxjs/operators";
import {HttpErrorHandlerService} from "./http-error-handler.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private api = `${environment.webserviceurl}`;

  constructor(private httpClient: HttpClient, private httpErrorHandler: HttpErrorHandlerService) {
  }

  getAllUsersFriends(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.api}/user/friends`).pipe(
      retry(3)
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.api}/user`).pipe(
      retry(3)
    );
  }

  updateUser(user: User) {
    return this.httpClient.put<User>(`${this.api}/user/${user.id}`, user).pipe(
      catchError(error => this.httpErrorHandler.rethrow(error))
    );
  }

  deleteUser(user: User) {
    return this.httpClient.delete<User>(`${this.api}/user/${user.id}`).pipe(
      catchError(error => this.httpErrorHandler.rethrow(error))
    );
  }
}
