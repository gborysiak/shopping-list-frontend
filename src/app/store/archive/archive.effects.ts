import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {catchError, map, switchMap} from 'rxjs/operators';
import { of } from 'rxjs';
import { ArchiveActions } from './archive.actions';
import {ShoppingListService} from "../../service/ShoppingList.service";


@Injectable()
export class ArchiveEffects {

  loadArchiv$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArchiveActions.loadArchive),
      switchMap(() => this.ShoppingListService.loadAllPartArchive().pipe(
          map(parts => ArchiveActions.loadArchiveSuccess({data: parts})),
          catchError(error => of(ArchiveActions.loadArchiveFailure({error})))
        )
      )
    );
  });


  constructor(private actions$: Actions, private ShoppingListService: ShoppingListService) {}
}
