import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable, retry} from "rxjs";
import {Part} from "../entities/Part";
import {catchError} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {HttpErrorHandlerService} from "./http-error-handler.service";


@Injectable({
  providedIn: 'root'
})
export class PartService  {
  private api = `${environment.webserviceurl}`;

  constructor(private httpClient: HttpClient, private httpErrorHandler: HttpErrorHandlerService) {
  }


  getAllPart(): Observable<Part[]> {
    return this.httpClient.get<Part[]>(`${this.api}/Part`).pipe(
      retry(3)
    );
  }

  createPart(part: Part) {
    return this.httpClient.post<Part>(`${this.api}/Part`, part).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }

  updatePart(part: Part) {
    return this.httpClient.put<Part>(`${this.api}/Part/${part.id}`, part).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }

  deletePart(part: Part) {
    return this.httpClient.delete<Part>(`${this.api}/Part/${part.id}`).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }

  }
