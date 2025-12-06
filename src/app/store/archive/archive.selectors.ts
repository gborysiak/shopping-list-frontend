import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromArchive from './archive.reducer';

export const selectArchiveState = createFeatureSelector<fromArchive.State>(
  fromArchive.archiveFeatureKey
);

export const selectAllPartArchive = createSelector(
  selectArchiveState,
  state => state.partsArchive
);
