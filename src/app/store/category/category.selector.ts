
import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromCategoryList from './category.reducer';

export const selectCategoryState = createFeatureSelector<fromCategoryList.State>(
  fromCategoryList.categoryFeatureKey
);

export const selectAllCategory = createSelector(
  selectCategoryState,
  state => state.categorysList
);

export const selectCategoryById = (categoryId: number) => createSelector(
  selectCategoryState,
  state => {
    return state.categorysList[state.categorysList.findIndex(category => category.id === categoryId)];
  }
)

