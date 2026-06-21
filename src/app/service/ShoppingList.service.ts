import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable, retry} from "rxjs";
import {catchError} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {ShoppingList} from "../entities/ShoppingList";
import {PartArchive} from "../entities/PartArchive";
import { ShoppingListItem } from '../entities/ShoppingListItem';
import {HttpErrorHandlerService} from "./http-error-handler.service";

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService  {
  private api = `${environment.webserviceurl}`;

  constructor(private httpClient: HttpClient, private httpErrorHandler: HttpErrorHandlerService) {
  }

  getAllShoppingList(): Observable<ShoppingList[]> {
    return this.httpClient.get<ShoppingList[]>(`${this.api}/ShoppingList`).pipe(
      retry(3)
    );
  }

  createShoppingList(shoppingList: ShoppingList) {
    return this.httpClient.post<ShoppingList>(`${this.api}/ShoppingList`, shoppingList).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }

  updateShoppingList(shoppingList: ShoppingList) {
    return this.httpClient.put<ShoppingList>(`${this.api}/ShoppingList`, shoppingList).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }

  deleteShoppingList(shoppingList: ShoppingList) {
    return this.httpClient.delete<ShoppingList>(`${this.api}/ShoppingList/${shoppingList.id}`).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }

  resetShoppingList(shoppingList: ShoppingList) {
    return this.httpClient.post<ShoppingList>(`${this.api}/ResetShoppingList`, shoppingList).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }


  createItem(shoppingListId: number, item: ShoppingListItem) {
    return this.httpClient.post<ShoppingListItem>(`${this.api}/ShoppingList/${shoppingListId}/Item`, item).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }

  updateItem(shoppingListId: number, item: ShoppingListItem) {
    return this.httpClient.put<ShoppingListItem>(`${this.api}/ShoppingList/${shoppingListId}/Item/${item.id}`, item).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }

  deleteItem(shoppingListId: number, item: ShoppingListItem) {
    return this.httpClient.delete<ShoppingListItem>(`${this.api}/ShoppingList/${shoppingListId}/Item/${item.id}`).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }

  archivePart(shoppingListId: number) {
    return this.httpClient.post<ShoppingListItem[]>(`${this.api}/ShoppingList/${shoppingListId}/archivedPart`, null).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }

  loadAllPartArchive(): Observable<PartArchive[]> {
    return this.httpClient.get<PartArchive[]>(`${this.api}/archiv`).pipe(
      retry(3)
    );
  }
}
