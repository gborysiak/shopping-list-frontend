import { createFeature, createReducer, on } from '@ngrx/store';
import { ArchiveActions } from './archive.actions';
import {PartArchive} from "../../entities/PartArchive";

export const archiveFeatureKey = 'archive';

export interface State {
  partsArchive: PartArchive[];
}

export const initialState: State = {
  partsArchive: []
};

export const reducer = createReducer(
  initialState,
  // loadArchiv
  on(ArchiveActions.loadArchiveSuccess, (state, action) => {
    return {...state, partsArchive: action.data}
  }),
);

export const archiveFeature = createFeature({
  name: archiveFeatureKey,
  reducer,
});

