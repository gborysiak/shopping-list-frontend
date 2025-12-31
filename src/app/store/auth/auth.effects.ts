import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {catchError, map, concatMap, tap} from 'rxjs/operators';
import {Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import {AuthActions} from "./auth.actions";
import {of} from "rxjs";
import {MessageService} from "primeng/api";
import {TranslateService,_} from "@ngx-translate/core";

@Injectable()
export class AuthEffects {
  
  private txtRegistration :string = 'auth.registration';
  private txtAutherror :string = 'auth.autherror';
  private message: string= '';

  register$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.register),
      map(action => action.data),
      concatMap(inputData => this.loginService.register(inputData).pipe(
        map(data => AuthActions.registerSuccess({data: data})),
        catchError(error => of(AuthActions.registerFailure({error})))
      ))
    )
  });

  registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerSuccess),
      tap((action) => {
        this.messageService.clear();
        this.message = this.translate.instant(this.txtRegistration);
        this.messageService.add({
          severity: 'success',
          summary: this.message
        });
        this.router.navigateByUrl("/login");
      }),
    ), {dispatch: false});

  login$ = createEffect(() => {
    console.log('$ AuthEffect.login')
    return this.actions$.pipe(
      ofType(AuthActions.login),
      map(action => action.data),
      concatMap(inputData => this.loginService.login(inputData).pipe(
        map(data => AuthActions.loginSuccess({data: data})),
        catchError(error => of(AuthActions.loginFailure({error})))
      ))
    )
  });

  loginSuccess$ = createEffect(() =>
    
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap((action) => {
        console.log('$ AuthEffect.loginSuccess / ' + JSON.stringify(action.data));
        this.loginService.saveLoginStateToLocalStorage(action.data);
        this.router.navigateByUrl("/home");
      }),
    ), {dispatch: false});

  refreshToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      map(action => action.data),
      concatMap(inputData => this.loginService.refreshToken(inputData).pipe(
        map(data => AuthActions.refreshTokenSuccess({data: data})),
        catchError(error => of(AuthActions.refreshTokenFailure({error})))
      ))
    )
  });

  refreshTokenSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshTokenSuccess),
      tap((action) => {
        console.log('$ AuthEffect.refreshTokenSuccess');
        //this.loginService.saveLoginStateToLocalStorage(action.data);
      }),
    ), {dispatch: false});

  loginFailure = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginFailure),
      tap((action) => {
        this.messageService.clear();
        this.message = this.translate.instant(this.txtAutherror);
        this.messageService.add({
          severity: 'error',
          summary:  this.message
        });
      }),
    ), {dispatch: false});

  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => AuthActions.logoutSuccess()),
      tap(data => {
        console.log('$ AuthEffect.logout');
        this.loginService.saveLoginStateToLocalStorage(null);
        this.router.navigateByUrl("/login");
      }),
    )
  });


  constructor(private actions$: Actions, private messageService: MessageService, private router: Router, 
    private loginService: AuthService, private translate: TranslateService) {}
}
