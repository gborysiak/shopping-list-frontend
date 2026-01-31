
import {createFeatureSelector, createSelector} from '@ngrx/store';
import { combineLatest } from 'rxjs';
import * as fromCategoryList from './category.reducer';
import { selectAllPart } from '../part/part.selector';
import { Part } from 'src/app/entities/Part';
import { Category } from 'src/app/entities/Category';

export const selectCategoryState = createFeatureSelector<fromCategoryList.State>(
  fromCategoryList.categoryFeatureKey
);


export const selectAllCategory = createSelector(
  selectCategoryState,
  state => state.category
);

export const selectCategoryById = (categoryId: number) => createSelector(
  selectCategoryState,
  state => {
    return state.category[state.category.findIndex(category => category.id === categoryId)];
  }
)

export const selectCategoryAndParts = createSelector(
  selectAllCategory,
  selectAllPart,
 (categorys, parts) => {
    return categorys.map(category => ({
      ...category,
      parts: parts.filter(part => part.categoryId === category.id)
    }));
  }
);  
