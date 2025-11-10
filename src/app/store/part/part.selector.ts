import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromPartList from './part.reducer';

export const selectPartState = createFeatureSelector<fromPartList.State>(
  fromPartList.partFeatureKey
);

export const selectAllPart = createSelector(
  selectPartState,
  state => state.partsList
);

export const selectPartById = (partId: number) => createSelector(
  selectPartState,
  state => {
    return state.partsList[state.partsList.findIndex(part => part.id === partId)];
  }
)


