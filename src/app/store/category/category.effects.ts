
import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, concatMap, map, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import { CategorysActions } from './category.actions';
import { CategoryService } from 'src/app/service/Category.service';
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";


@Injectable()
export class CategoryEffects {
  loadCategorys$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CategorysActions.loadCategorys),
      this.loadAllCategory()
    );
  });

  createCategory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CategorysActions.createCategory),
      concatMap(inputData => this.categoryService.createCategory(inputData.data).pipe(
        map(data => CategorysActions.createCategorySuccess({data: data})),
        catchError(error => of(CategorysActions.createCategoryFailure({error})))
      ))
    )
  });

  createCategorySuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CategorysActions.createCategorySuccess),
      this.navigateToHomeWithMessage('La liste d\'achats a été enregistrée.'),
      this.loadAllCategory()
    )
  });

  updateCategory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CategorysActions.updateCategory),
      map(action => action.data),
      concatMap(inputData => this.categoryService.updateCategory(inputData).pipe(
        map(data => CategorysActions.updateCategorySuccess({data: data})),
        catchError(error => of(CategorysActions.updateCategoryFailure({error})))
      ))
    )
  });

  updateCategorySuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CategorysActions.updateCategorySuccess),
      this.navigateToHomeWithMessage('ShoppingList wurde gespeichert'),
      this.loadAllCategory()
    )
  });

  deleteCategory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CategorysActions.deleteCategory),
      map(action => action.data),
      concatMap(inputData => this.categoryService.deleteCategory(inputData).pipe(
        map(data => CategorysActions.deleteCategorySuccess({data: data})),
        catchError(error => of(CategorysActions.deleteCategoryFailure({error})))
      )),
      this.loadAllCategory()
    )
  });

  deleteCategorySuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CategorysActions.deleteCategorySuccess),
      this.navigateToHomeWithMessage('ShoppingList wurde gelöscht'),
      this.loadAllCategory()
    )
  });

 

  private loadAllCategory() {
    return concatMap(() => this.categoryService.getAllCategory().pipe(
      map(data => CategorysActions.loadCategorysSuccess({data: data})),
      catchError(error => of(CategorysActions.loadCategorysFailure({error})))
    ));
  }

  private navigateToHomeWithMessage(message: string) {
    return this.navigateWithMessage(message, 'home');
  }

  private navigateWithMessage(message: string, navigationTarget: string) {
    return tap(() => {
      this.router.navigateByUrl(`/${navigationTarget}`);
      this.messageService.clear();
      this.messageService.add({severity: 'success', summary: message});
    });
  }

  constructor(private actions$: Actions, private messageService: MessageService, private router: Router, private categoryService: CategoryService) {
  }
}
