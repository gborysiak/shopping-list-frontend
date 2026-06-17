import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable, retry} from "rxjs";
import {catchError} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {ShoppingList} from "../entities/ShoppingList";
import {PartArchive} from "../entities/PartArchive";
import { ShoppinglistItem } from '../entities/ShoppingListItem';
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

  createItem(shoppingListId: number, item: ShoppinglistItem) {
    return this.httpClient.post<ShoppinglistItem>(`${this.api}/ShoppingList/${shoppingListId}/Item`, item).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }

  updateItem(shoppingListId: number, item: ShoppinglistItem) {
    return this.httpClient.put<ShoppinglistItem>(`${this.api}/ShoppingList/${shoppingListId}/Item/${item.id}`, item).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }

  deleteItem(shoppingListId: number, item: ShoppinglistItem) {
    return this.httpClient.delete<ShoppinglistItem>(`${this.api}/ShoppingList/${shoppingListId}/Item/${item.id}`).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }

  archivePart(shoppingListId: number) {
    return this.httpClient.post<ShoppinglistItem[]>(`${this.api}/ShoppingList/${shoppingListId}/archivedPart`, null).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }

  loadAllPartArchive(): Observable<PartArchive[]> {
    return this.httpClient.get<PartArchive[]>(`${this.api}/archiv`).pipe(
      retry(3)
    );
  }
}
