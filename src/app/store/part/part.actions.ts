import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { HttpErrorResponse } from "@angular/common/http";
import { Part } from "src/app/entities/Part";


export const PartsActions = createActionGroup({
  source: 'Part',
  events: {
    'Load Parts':  emptyProps(), 
    'Load Parts Success': props<{ data: Part[] }>(),
    'Load Parts Failure': props<{ error: any }>(),
 
    'Create Part': props<{ data: Part }>(),
    'Create Part Success': props<{ data: Part }>(),
    'Create Part Failure': props<{ error: HttpErrorResponse }>(),

    'Update Part': props<{ data: Part }>(),
    'Update Part Success': props<{ data: Part }>(),
    'Update Part Failure': props<{ error: HttpErrorResponse }>(),

    'Delete Part': props<{ data: Part }>(),
    'Delete Part Success': props<{ data: Part }>(),
    'Delete Part Failure': props<{ error: HttpErrorResponse }>()
  },
});
