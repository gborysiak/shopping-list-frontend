
import {Injectable,  OnInit} from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {Observable, retry, throwError} from "rxjs";
import {Category} from "../entities/Category";
import {catchError} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {MessageService} from "primeng/api";
import {TranslateService, _} from "@ngx-translate/core";


@Injectable({
  providedIn: 'root'
})

export class CategoryService  {
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

    var summary = this.getTranslation('categoryservice.error') + handleErrResponse.response;
    this.messageService.add({severity: 'error', summary: summary});
    return throwError(() => error);
  }

  getAllCategory(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(`${this.api}/Category`).pipe(
      retry(3)
    );
  }

  createCategory(category: Category) {
  return this.httpClient.post<Category>(`${this.api}/Category`, category).pipe(
      catchError(error => this.errorHandler(error))
    );
  }

  updateCategory(category: Category) {
    return this.httpClient.put<Category>(`${this.api}/Category/${category.id}`, category).pipe(
      catchError(error => this.errorHandler(error))
    );
  }

  deleteCategory(category: Category) {
    return this.httpClient.delete<Category>(`${this.api}/Category/${category.id}`).pipe(
      catchError(error => this.errorHandler(error))
    );
  }

  }

