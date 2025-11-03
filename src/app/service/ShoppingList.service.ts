import {Injectable} from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {Observable, retry, throwError} from "rxjs";
import {Part} from "../entities/Part";
import {catchError} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {ShoppingList} from "../entities/ShoppingList";
import {PartArchive} from "../entities/PartArchive";

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private api = `${environment.webserviceurl}`;

  constructor(private httpClient: HttpClient) {
  }

  private static errorHandler(error: HttpErrorResponse): Observable<never> {
    console.error('Fehler aufgetreten!' + error);
    return throwError(() => error);
  }

  getAllShoppingList(): Observable<ShoppingList[]> {
    return this.httpClient.get<ShoppingList[]>(`${this.api}/ShoppingList`).pipe(
      retry(3)
    );
  }

  createShoppingList(shoppingList: ShoppingList) {
    return this.httpClient.post<ShoppingList>(`${this.api}/ShoppingList`, shoppingList).pipe(
      catchError(ShoppingListService.errorHandler)
    );
  }

  updateShoppingList(shoppingList: ShoppingList) {
    return this.httpClient.put<ShoppingList>(`${this.api}/ShoppingList/${shoppingList.id}`, shoppingList).pipe(
      catchError(ShoppingListService.errorHandler)
    );
  }

  deleteShoppingList(shoppingList: ShoppingList) {
    return this.httpClient.delete<ShoppingList>(`${this.api}/ShoppingList/${shoppingList.id}`).pipe(
      catchError(ShoppingListService.errorHandler)
    );
  }

  createPart(shoppingListId: number, part: Part) {
    return this.httpClient.post<Part>(`${this.api}/ShoppingList/${shoppingListId}/part`, part).pipe(
      catchError(ShoppingListService.errorHandler)
    );
  }

  updatePart(shoppingListId: number, part: Part) {
    return this.httpClient.put<Part>(`${this.api}/ShoppingList/${shoppingListId}/part/${part.id}`, part).pipe(
      catchError(ShoppingListService.errorHandler)
    );
  }

  deletePart(shoppingListId: number, part: Part) {
    return this.httpClient.delete<Part>(`${this.api}/ShoppingList/${shoppingListId}/part/${part.id}`).pipe(
      catchError(ShoppingListService.errorHandler)
    );
  }

  archivePart(shoppingListId: number) {
    return this.httpClient.post<Part[]>(`${this.api}/ShoppingList/${shoppingListId}/archivedPart`, null).pipe(
      catchError(ShoppingListService.errorHandler)
    );
  }

  loadAllPartArchive(): Observable<PartArchive[]> {
    return this.httpClient.get<PartArchive[]>(`${this.api}/archiv`).pipe(
      retry(3)
    );
  }
}
