import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, concatMap, map, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import { PartsActions } from './part.actions';
import { PartService } from 'src/app/service/Part.service';
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";


@Injectable()
export class PartEffects {
  loadParts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PartsActions.loadParts),
      this.loadAllPart()
    );
  });

  createPart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PartsActions.createPart),
      concatMap(inputData => this.partService.createPart(inputData.data).pipe(
        map(data => PartsActions.createPartSuccess({data: data})),
        catchError(error => of(PartsActions.createPartFailure({error})))
      ))
    )
  });

  createPartSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PartsActions.createPartSuccess),
      this.navigateToHomeWithMessage('La liste d\'achats a été enregistrée.'),
      this.loadAllPart()
    )
  });

  updatePart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PartsActions.updatePart),
      map(action => action.data),
      concatMap(inputData => this.partService.updatePart(inputData).pipe(
        map(data => PartsActions.updatePartSuccess({data: data})),
        catchError(error => of(PartsActions.updatePartFailure({error})))
      ))
    )
  });

  updatePartSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PartsActions.updatePartSuccess),
      this.navigateToHomeWithMessage('ShoppingList wurde gespeichert'),
      this.loadAllPart()
    )
  });

  deletePart$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PartsActions.deletePart),
      map(action => action.data),
      concatMap(inputData => this.partService.deletePart(inputData).pipe(
        map(data => PartsActions.deletePartSuccess({data: data})),
        catchError(error => of(PartsActions.deletePartFailure({error})))
      )),
      this.loadAllPart()
    )
  });

  deletePartSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PartsActions.deletePartSuccess),
      this.navigateToHomeWithMessage('ShoppingList wurde gelöscht'),
      this.loadAllPart()
    )
  });

 

  private loadAllPart() {
    return concatMap(() => this.partService.getAllPart().pipe(
      map(data => PartsActions.loadPartsSuccess({data: data})),
      catchError(error => of(PartsActions.loadPartsFailure({error})))
    ));
  }

  private navigateToHomeWithMessage(message: string) {
    return this.navigateWithMessage(message, 'home');
  }

  private navigateWithMessage(message: string, navigationTarget: string) {
    return tap(() => {
      this.router.navigateByUrl(`/${navigationTarget}`);
      this.messageService.clear();
      this.messageService.add({severity: 'success', summary: message});
    });
  }

  constructor(private actions$: Actions, private messageService: MessageService, private router: Router, private partService: PartService) {
  }
}
