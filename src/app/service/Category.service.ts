import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable, retry} from "rxjs";
import {Category} from "../entities/Category";
import {catchError} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {HttpErrorHandlerService} from "./http-error-handler.service";


@Injectable({
  providedIn: 'root'
})

export class CategoryService  {
  private api = `${environment.webserviceurl}`;

  constructor(private httpClient: HttpClient, private httpErrorHandler: HttpErrorHandlerService) {
  }

  getAllCategory(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(`${this.api}/Category`).pipe(
      retry(3)
    );
  }

  createCategory(category: Category) {
  return this.httpClient.post<Category>(`${this.api}/Category`, category).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }

  updateCategory(category: Category) {
    return this.httpClient.put<Category>(`${this.api}/Category`, category).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }

  deleteCategory(category: Category) {
    return this.httpClient.delete<Category>(`${this.api}/Category/${category.id}`).pipe(
      catchError(error => this.httpErrorHandler.handle(error))
    );
  }

  }

