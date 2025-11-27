import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromShoppingList from './shoppinglist.reducer';
import { selectAllPart } from '../part/part.selector';

export const selectShoppingListState = createFeatureSelector<fromShoppingList.State>(
  fromShoppingList.shoppingListFeatureKey
);

export const selectAllShoppingList = createSelector(
  selectShoppingListState,
  state => state.shoppingList
);


export const selectShoppingListById = (shoppingId: number) => createSelector(
  selectShoppingListState,
  state => {
    return state.shoppingList[state.shoppingList.findIndex(shoppingList => shoppingList.id === shoppingId)];
  }
)

export const selectItemById = (shoppingId: number, itemId: number) => createSelector(
  selectShoppingListState,
  state => {
    // @ts-ignore
    return state.shoppingList[state.shoppingList.findIndex(shoppingList => shoppingList.id === shoppingId)].shoppingListItem.filter(item => item.id === itemId)[0];
  }
)

  