
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { HttpErrorResponse } from "@angular/common/http";
import { Category } from "src/app/entities/Category";


export const CategorysActions = createActionGroup({
  source: 'Category',
  events: {
    'Load Categorys':  emptyProps(), 
    'Load Categorys Success': props<{ data: Category[] }>(),
    'Load Categorys Failure': props<{ error: any }>(),
 
    'Create Category': props<{ data: Category }>(),
    'Create Category Success': props<{ data: Category }>(),
    'Create Category Failure': props<{ error: HttpErrorResponse }>(),

    'Update Category': props<{ data: Category }>(),
    'Update Category Success': props<{ data: Category }>(),
    'Update Category Failure': props<{ error: HttpErrorResponse }>(),

    'Delete Category': props<{ data: Category }>(),
    'Delete Category Success': props<{ data: Category }>(),
    'Delete Category Failure': props<{ error: HttpErrorResponse }>()
  },
});
