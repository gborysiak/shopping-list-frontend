import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, concatMap, map} from 'rxjs/operators';
import {of} from 'rxjs';
import {ShoppingListActions} from './shoppinglist.actions';
import {ShoppingListService} from "../../service/ShoppingList.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {navigateWithMessage} from '../navigate-with-message';


@Injectable()
export class ShoppingListEffects {

  private txtCreated  = 'shoppinglist.created';
  private txtUpdated  = 'shoppinglist.updated';
  private txtDeleted  = 'shoppinglist.deleted';
  private txtReset  = 'shoppinglist.reseted';


  private partCreated  = 'part.created';
  private partUpdated  = 'part.updated';
  private partDeleted  = 'part.deleted';
  private partArchived  = 'part.archived';


  loadShoppingLists$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShoppingListActions.loadShoppingLists),
      this.loadAllShoppingList()
    );
  });

  createShoppingList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShoppingListActions.createShoppingList),
      concatMap(inputData => this.ShoppingListService.createShoppingList(inputData.data).pipe(
        map(data => ShoppingListActions.createShoppingListSuccess({data: data})),
        catchError(error => of(ShoppingListActions.createShoppingListFailure({error})))
      ))
    )
  });

  createShoppingListSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShoppingListActions.createShoppingListSuccess),
      this.navigateToHomeWithMessage(this.txtCreated),
      this.loadAllShoppingList()
    )
  });

  updateShoppingList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShoppingListActions.updateShoppingList),
      map(action => action.data),
      concatMap(inputData => this.ShoppingListService.updateShoppingList(inputData).pipe(
        map(data => ShoppingListActions.updateShoppingListSuccess({data: data})),
        catchError(error => of(ShoppingListActions.updateShoppingListFailure({error})))
      ))
    )
  });

  updateShoppingListSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShoppingListActions.updateShoppingListSuccess),
      this.navigateToHomeWithMessage(this.txtUpdated),
      this.loadAllShoppingList()
    )
  });

  deleteShoppingList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShoppingListActions.deleteShoppingList),
      map(action => action.data),
      concatMap(inputData => this.ShoppingListService.deleteShoppingList(inputData).pipe(
        map(data => ShoppingListActions.deleteShoppingListSuccess({data: data})),
        catchError(error => of(ShoppingListActions.deleteShoppingListFailure({error})))
      ))
    )
  });

  deleteShoppingListSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShoppingListActions.deleteShoppingListSuccess),
      this.navigateToHomeWithMessage(this.txtDeleted),
      this.loadAllShoppingList()
    )
  });

  resetShoppingList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShoppingListActions.resetShoppingList),
      map(action => action.data),
      concatMap(inputData => this.ShoppingListService.resetShoppingList(inputData).pipe(
        map(data => ShoppingListActions.resetShoppingListSuccess({data: data})),
        catchError(error => of(ShoppingListActions.resetShoppingListFailure({error})))
      ))
    )
  });

  resetShoppingListSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShoppingListActions.resetShoppingListSuccess),
      this.navigateToHomeWithMessage(this.txtReset),
      this.loadAllShoppingList()
    )
  });

  createArtikel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShoppingListActions.createItem),
      concatMap(inputData => this.ShoppingListService.createItem(inputData.shoppingId, inputData.data).pipe(
        map(item => ShoppingListActions.createItemSuccess({data: item})),
        catchError(error => of(ShoppingListActions.createItemFailure({error})))
      ))
    )
  });

  createArtikelSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShoppingListActions.createItemSuccess),
      this.navigateToHomeWithMessage(this.partCreated),
      this.loadAllShoppingList()
    )
  });

  updateArtikel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShoppingListActions.updateItem),
      concatMap(inputData => this.ShoppingListService.updateItem(inputData.shoppingId, inputData.data).pipe(
        map(data => ShoppingListActions.updateItemSuccess({data: data})),
        catchError(error => of(ShoppingListActions.updateItemFailure({error})))
      ))
    )
  });

  updateArtikelSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShoppingListActions.updateItemSuccess),
      this.navigateToHomeWithMessage(this.partUpdated),
      this.loadAllShoppingList()
    )
  });

  deleteArtikel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShoppingListActions.deleteItem),
      concatMap(inputData => this.ShoppingListService.deleteItem(inputData.shoppingId, inputData.data).pipe(
        map(data => ShoppingListActions.deleteItemSuccess({data: data})),
        catchError(error => of(ShoppingListActions.deleteItemFailure({error})))
      ))
    )
  });

  deleteArtikelSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShoppingListActions.deleteItemSuccess),
      this.navigateToHomeWithMessage(this.partDeleted),
      this.loadAllShoppingList()
    )
  });

  archiviereArtikel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShoppingListActions.archiveItem),
      concatMap(inputData => this.ShoppingListService.archivePart(inputData.shoppingId).pipe(
        map(data => ShoppingListActions.archiveItemSuccess({data: data})),
        catchError(error => of(ShoppingListActions.archiveItemFailure({error})))
      ))
    )
  });

  archiviereArtikelSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ShoppingListActions.archiveItemSuccess),
      this.navigateToHomeWithMessage(this.partArchived),
      this.loadAllShoppingList()
    )
  });

  private loadAllShoppingList() {
    return concatMap(() => this.ShoppingListService.getAllShoppingList().pipe(
      map(data => ShoppingListActions.loadShoppingListsSuccess({data: data})),
      catchError(error => of(ShoppingListActions.loadShoppingListsFailure({error})))
    ));
  }

  private navigateToHomeWithMessage(message: string) {
    return this.navigateWithMessage(message, 'home');
  }

  private navigateWithMessage(key: string, navigationTarget: string) {
    return navigateWithMessage(this.router, this.messageService, this.translate, key, navigationTarget);
  }

  constructor(private actions$: Actions, private messageService: MessageService, private router: Router, 
    private ShoppingListService: ShoppingListService, private translate: TranslateService) {
  }
}
