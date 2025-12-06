
import { createReducer, on, createFeature } from "@ngrx/store";
import { CategorysActions} from "./category.actions";
import { Category } from "src/app/entities/Category";


export const categoryFeatureKey = 'category';

// Interface représentant l'état des utilisateurs
export interface State {
    category: Category[];  // liste des articles
    loading: boolean;   // Indicateur de chargement
}

const initialState: State = {
    category: [],    // Liste initiale vide d'article
    loading: true     // Indicateur de chargement initialisé à true
};

export const categoryReducer = createReducer(
  initialState,

  // loadEinkaufszettels
  on(CategorysActions.loadCategorysSuccess, (state, action) => {
    return {...state, category: action.data}
  })
);

export const categoryFeature = createFeature({
  name: categoryFeatureKey,
  reducer: categoryReducer,
});
