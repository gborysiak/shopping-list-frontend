import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromShoppingList from './shoppinglist.reducer';

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

export const selectPartById = (shoppingId: number, partId: number) => createSelector(
  selectShoppingListState,
  state => {
    // @ts-ignore
    return state.shoppingList[state.shoppingList.findIndex(shoppingList => shoppingList.id === shoppingId)].artikels.filter(part => part.id === partId)[0];
  }
)
