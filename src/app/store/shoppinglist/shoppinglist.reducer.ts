import {createFeature, createReducer, on} from '@ngrx/store';
import {ShoppingListActions} from './shoppinglist.actions';
import {ShoppingList} from "../../entities/ShoppingList";

export const shoppingListFeatureKey = 'shoppingList';

export interface State {
  shoppingList: ShoppingList[];
}

export const initialState: State = {
  shoppingList: []
};

export const shoppingListReducer = createReducer(
  initialState,

  // loadEinkaufszettels
  on(ShoppingListActions.loadShoppingListsSuccess, (state, action) => {
    return {...state, shoppingList: action.data}
  })
);

export const shoppingListFeature = createFeature({
  name: shoppingListFeatureKey,
  reducer: shoppingListReducer,
});

