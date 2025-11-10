import {Injectable,  OnInit} from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {Observable, retry, throwError} from "rxjs";
import {Part} from "../entities/Part";
import {catchError} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {MessageService} from "primeng/api";
import {TranslateService, _} from "@ngx-translate/core";


@Injectable({
  providedIn: 'root'
})
export class PartService  {
  private api = `${environment.webserviceurl}`;
  private errorMessage: string = '';
  private translate: TranslateService;

  constructor(private httpClient: HttpClient, private messageService: MessageService, translate: TranslateService) {
    this.translate = translate;
  }

  getTranslation(key: string): string {
    return this.translate.instant(key); 
  }

  private errorHandler(error: any): Observable<never> {
 
    let err = error.error;
    console.error('Fehler aufgetreten!' + err);
    let handleErrResponse = {
    status: err.status,
    errorText: err.message || err.errorMessage || err.title,
    response: err,
    };

    if (err.status == 400) {
      

      let errors = Object.entries(err.errors).reduce(
        (acc, [key, value] ) => {
            acc.push({  
              field: key,
              error: String(value)
          });
          return acc;
        },
        [] as { field: string; error: string }[]
      );
      
      var strErrors = '';
      for(var i = 0; i < errors.length; i++) {
        strErrors = strErrors + errors[i].field + " " + errors[i].error;
      }

      handleErrResponse.response = strErrors;
    }

    var summary = this.getTranslation('shoppinglistservice.error') + handleErrResponse.response;
    this.messageService.add({severity: 'error', summary: summary});
    return throwError(() => error);
  }

  getAllPart(): Observable<Part[]> {
    return this.httpClient.get<Part[]>(`${this.api}/Part`).pipe(
      retry(3)
    );
  }

  createPart(part: Part) {
    return this.httpClient.post<Part>(`${this.api}/Part`, part).pipe(
      catchError(error => this.errorHandler(error))
    );
  }

  updatePart(part: Part) {
    return this.httpClient.put<Part>(`${this.api}/Part/${part.id}`, part).pipe(
      catchError(error => this.errorHandler(error))
    );
  }

  deletePart(part: Part) {
    return this.httpClient.delete<Part>(`${this.api}/Part/${part.id}`).pipe(
      catchError(error => this.errorHandler(error))
    );
  }

  }
