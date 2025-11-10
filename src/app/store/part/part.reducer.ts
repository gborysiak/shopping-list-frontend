import { createReducer, on, createFeature } from "@ngrx/store";
import { PartsActions} from "./part.actions";
import { Part } from "src/app/entities/Part";


export const partFeatureKey = 'part';

// Interface représentant l'état des utilisateurs
export interface State {
    partsList: Part[];  // liste des articles
    loading: boolean;   // Indicateur de chargement
}

const initialState: State = {
    partsList: [],    // Liste initiale vide d'article
    loading: true     // Indicateur de chargement initialisé à true
};

export const partReducer = createReducer(
  initialState,

  // loadEinkaufszettels
  on(PartsActions.loadPartsSuccess, (state, action) => {
    return {...state, part: action.data}
  })
);

export const partFeature = createFeature({
  name: partFeatureKey,
  reducer: partReducer,
});