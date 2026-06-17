import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable, retry} from "rxjs";
import {environment} from "../../environments/environment";
import {Role} from "../entities/role";

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private api = `${environment.webserviceurl}`;

  constructor(private httpClient: HttpClient) {
  }

  getAllRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(`${this.api}/role`).pipe(
      retry(3)
    );
  }
}
