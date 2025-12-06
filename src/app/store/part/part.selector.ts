import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromPartList from './part.reducer';
//import { selectAllCategory } from '../category/category.selectors';

export const selectPartState = createFeatureSelector<fromPartList.State>(
  fromPartList.partFeatureKey
);

export const selectAllPart = createSelector(
  selectPartState,
  state => state.part
);


export const selectPartById = (partId: number) => createSelector(
  selectPartState,
  state => {
    return state.part[state.part.findIndex(part => part.id === partId)];
  }
)


