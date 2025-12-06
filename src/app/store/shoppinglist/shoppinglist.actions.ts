import {createActionGroup, emptyProps, props} from '@ngrx/store';
import { HttpErrorResponse } from "@angular/common/http";
//import {Part} from "../../entities/Part";
import {ShoppinglistItem} from "../../entities/ShoppingListItem";
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


    'Load Items': emptyProps(),
    'Load Items Success': props<{ data: ShoppinglistItem[] }>(),
    'Load Items Failure': props<{ error: HttpErrorResponse }>(),

    'Create Item': props<{ shoppingId: number, data: ShoppinglistItem }>(), //shoppingId einkaufszettelId
    'Create Item Success': props<{ data: ShoppinglistItem }>(),
    'Create Item Failure': props<{ error: HttpErrorResponse }>(),

    'Update Item': props<{ shoppingId: number, data: ShoppinglistItem }>(),
    'Update Item Success': props<{ data: ShoppinglistItem }>(),
    'Update Item Failure': props<{ error: HttpErrorResponse }>(),

    'Delete Item': props<{ shoppingId: number, data: ShoppinglistItem }>(),
    'Delete Item Success': props<{ data: ShoppinglistItem }>(),
    'Delete Item Failure': props<{ error: HttpErrorResponse }>(),

    'Archive Item': props<{ shoppingId: number }>(),
    'Archive Item Success': props<{ data: ShoppinglistItem[] }>(),
    'Archive Item Failure': props<{ error: HttpErrorResponse }>(),
  }
});
