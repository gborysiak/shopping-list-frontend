import {Injectable,  OnInit} from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {Observable, retry, throwError} from "rxjs";
//import {Part} from "../entities/Part";
import {catchError} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {ShoppingList} from "../entities/ShoppingList";
import {PartArchive} from "../entities/PartArchive";
import {MessageService} from "primeng/api";
import {TranslateService, _} from "@ngx-translate/core";
import { ShoppinglistItem } from '../entities/ShoppingListItem';

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
    return this.httpClient.put<ShoppingList>(`${this.api}/ShoppingList`, shoppingList).pipe(
      catchError(error => this.errorHandler(error))
    );
  }

  deleteShoppingList(shoppingList: ShoppingList) {
    return this.httpClient.delete<ShoppingList>(`${this.api}/ShoppingList/${shoppingList.id}`).pipe(
      catchError(error => this.errorHandler(error))
    );
  }

  createItem(shoppingListId: number, item: ShoppinglistItem) {
    return this.httpClient.post<ShoppinglistItem>(`${this.api}/ShoppingList/${shoppingListId}/Item`, item).pipe(
      catchError(error => this.errorHandler(error))
    );
  }

  updateItem(shoppingListId: number, item: ShoppinglistItem) {
    return this.httpClient.put<ShoppinglistItem>(`${this.api}/ShoppingList/${shoppingListId}/Item/${item.id}`, item).pipe(
      catchError(error => this.errorHandler(error))
    );
  }

  deleteItem(shoppingListId: number, item: ShoppinglistItem) {
    return this.httpClient.delete<ShoppinglistItem>(`${this.api}/ShoppingList/${shoppingListId}/Item/${item.id}`).pipe(
      catchError(error => this.errorHandler(error))
    );
  }

  archivePart(shoppingListId: number) {
    return this.httpClient.post<ShoppinglistItem[]>(`${this.api}/ShoppingList/${shoppingListId}/archivedPart`, null).pipe(
      catchError(error => this.errorHandler(error))
    );
  }

  loadAllPartArchive(): Observable<PartArchive[]> {
    return this.httpClient.get<PartArchive[]>(`${this.api}/archiv`).pipe(
      retry(3)
    );
  }
}
