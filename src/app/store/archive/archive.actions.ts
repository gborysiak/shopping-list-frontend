import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { HttpErrorResponse } from "@angular/common/http";
import {PartArchive} from "../../entities/PartArchive";

export const ArchiveActions = createActionGroup({
  source: 'Archive',
  events: {
    'Load Archive': emptyProps(),
    'Load Archive Success': props<{ data: PartArchive[] }>(),
    'Load Archive Failure': props<{ error: HttpErrorResponse }>(),
  }
});
