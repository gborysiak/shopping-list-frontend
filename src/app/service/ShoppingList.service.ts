import {Injectable,  OnInit} from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {Observable, retry, throwError} from "rxjs";
import {Part} from "../entities/Part";
import {catchError} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {ShoppingList} from "../entities/ShoppingList";
import {PartArchive} from "../entities/PartArchive";
import {MessageService} from "primeng/api";
import {TranslateService, _} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService  {
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

  getAllShoppingList(): Observable<ShoppingList[]> {
    return this.httpClient.get<ShoppingList[]>(`${this.api}/ShoppingList`).pipe(
      retry(3)
    );
  }

  createShoppingList(shoppingList: ShoppingList) {
    return this.httpClient.post<ShoppingList>(`${this.api}/ShoppingList`, shoppingList).pipe(
      catchError(error => this.errorHandler(error))
    );
  }

  updateShoppingList(shoppingList: ShoppingList) {
    return this.httpClient.put<ShoppingList>(`${this.api}/ShoppingList/${shoppingList.id}`, shoppingList).pipe(
      catchError(error => this.errorHandler(error))
    );
  }

  deleteShoppingList(shoppingList: ShoppingList) {
    return this.httpClient.delete<ShoppingList>(`${this.api}/ShoppingList/${shoppingList.id}`).pipe(
      catchError(error => this.errorHandler(error))
    );
  }

  createPart(shoppingListId: number, part: Part) {
    return this.httpClient.post<Part>(`${this.api}/ShoppingList/${shoppingListId}/part`, part).pipe(
      catchError(error => this.errorHandler(error))
    );
  }

  updatePart(shoppingListId: number, part: Part) {
    return this.httpClient.put<Part>(`${this.api}/ShoppingList/${shoppingListId}/part/${part.id}`, part).pipe(
      catchError(error => this.errorHandler(error))
    );
  }

  deletePart(shoppingListId: number, part: Part) {
    return this.httpClient.delete<Part>(`${this.api}/ShoppingList/${shoppingListId}/part/${part.id}`).pipe(
      catchError(error => this.errorHandler(error))
    );
  }

  archivePart(shoppingListId: number) {
    return this.httpClient.post<Part[]>(`${this.api}/ShoppingList/${shoppingListId}/archivedPart`, null).pipe(
      catchError(error => this.errorHandler(error))
    );
  }

  loadAllPartArchive(): Observable<PartArchive[]> {
    return this.httpClient.get<PartArchive[]>(`${this.api}/archiv`).pipe(
      retry(3)
    );
  }
}
