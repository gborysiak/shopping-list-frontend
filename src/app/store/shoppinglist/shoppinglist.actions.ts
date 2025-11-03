import {createActionGroup, emptyProps, props} from '@ngrx/store';
import { HttpErrorResponse } from "@angular/common/http";
import {Part} from "../../entities/Part";
import {ShoppingList} from "../../entities/ShoppingList";

export const ShoppingListActions = createActionGroup({
  source: 'ShoppingList',
  events: {
    'Load ShoppingLists': emptyProps(),
    'Load ShoppingLists Success': props<{ data: ShoppingList[] }>(),
    'Load ShoppingLists Failure': props<{ error: HttpErrorResponse }>(),

    'Create ShoppingList': props<{ data: ShoppingList }>(),
    'Create ShoppingList Success': props<{ data: ShoppingList }>(),
    'Create ShoppingList Failure': props<{ error: HttpErrorResponse }>(),

    'Update ShoppingList': props<{ data: ShoppingList }>(),
    'Update ShoppingList Success': props<{ data: ShoppingList }>(),
    'Update ShoppingList Failure': props<{ error: HttpErrorResponse }>(),

    'Delete ShoppingList': props<{ data: ShoppingList }>(),
    'Delete ShoppingList Success': props<{ data: ShoppingList }>(),
    'Delete ShoppingList Failure': props<{ error: HttpErrorResponse }>(),


    'Load Parts': emptyProps(),
    'Load Parts Success': props<{ data: Part[] }>(),
    'Load Parts Failure': props<{ error: HttpErrorResponse }>(),

    'Create Part': props<{ shoppingId: number, data: Part }>(), //shoppingId einkaufszettelId
    'Create Part Success': props<{ data: Part }>(),
    'Create Part Failure': props<{ error: HttpErrorResponse }>(),

    'Update Part': props<{ shoppingId: number, data: Part }>(),
    'Update Part Success': props<{ data: Part }>(),
    'Update Part Failure': props<{ error: HttpErrorResponse }>(),

    'Delete Part': props<{ shoppingId: number, data: Part }>(),
    'Delete Part Success': props<{ data: Part }>(),
    'Delete Part Failure': props<{ error: HttpErrorResponse }>(),

    'Archive Part': props<{ shoppingId: number }>(),
    'Archive Part Success': props<{ data: Part[] }>(),
    'Archive Part Failure': props<{ error: HttpErrorResponse }>(),
  }
});
