import {HttpErrorResponse} from '@angular/common/http';
import {of, throwError} from 'rxjs';
import {AuthEffects} from './auth.effects';
import {AuthActions} from './auth.actions';
import {AuthService} from '../../service/auth.service';
import {User} from '@app/entities/user';
import {setupEffects} from '@app/testing/effects-testing';

describe('AuthEffects', () => {
  const user: User = {username: 'alice', password: 'secret', token: 't'};
  const error = new HttpErrorResponse({status: 401});

  let service: jasmine.SpyObj<AuthService>;
  let ctx: ReturnType<typeof setupEffects<AuthEffects>>;

  beforeEach(() => {
    service = jasmine.createSpyObj<AuthService>('AuthService',
      ['register', 'login', 'refreshToken', 'saveLoginStateToLocalStorage']);
    ctx = setupEffects(AuthEffects, [{provide: AuthService, useValue: service}]);
  });

  describe('login', () => {
    it('emits loginSuccess with the user returned by the backend', async () => {
      service.login.and.returnValue(of(user));

      const result = await ctx.emitted(ctx.effects.login$, AuthActions.login({data: user}));

      expect(service.login).toHaveBeenCalledWith(user);
      expect(result).toEqual([AuthActions.loginSuccess({data: user})]);
    });

    it('emits loginFailure when the backend rejects the credentials', async () => {
      service.login.and.returnValue(throwError(() => error));

      const result = await ctx.emitted(ctx.effects.login$, AuthActions.login({data: user}));

      expect(result).toEqual([AuthActions.loginFailure({error})]);
    });

    it('stores the user and goes home on success', async () => {
      await ctx.emitted(ctx.effects.loginSuccess$, AuthActions.loginSuccess({data: user}));

      expect(service.saveLoginStateToLocalStorage).toHaveBeenCalledOnceWith(user);
      expect(ctx.router.navigateByUrl).toHaveBeenCalledOnceWith('/home');
    });

    it('shows an error toast on failure', async () => {
      await ctx.emitted(ctx.effects.loginFailure, AuthActions.loginFailure({error}));

      expect(ctx.messageService.add).toHaveBeenCalledOnceWith({severity: 'error', summary: 'auth.autherror'});
    });
  });

  describe('register', () => {
    it('emits registerSuccess, then toasts and goes to the login page', async () => {
      service.register.and.returnValue(of(user));

      expect(await ctx.emitted(ctx.effects.register$, AuthActions.register({data: user})))
        .toEqual([AuthActions.registerSuccess({data: user})]);

      await ctx.emitted(ctx.effects.registerSuccess$, AuthActions.registerSuccess({data: user}));

      expect(ctx.messageService.add).toHaveBeenCalledOnceWith({severity: 'success', summary: 'auth.registration'});
      expect(ctx.router.navigateByUrl).toHaveBeenCalledOnceWith('/login');
    });

    it('emits registerFailure when registration fails', async () => {
      service.register.and.returnValue(throwError(() => error));

      const result = await ctx.emitted(ctx.effects.register$, AuthActions.register({data: user}));

      expect(result).toEqual([AuthActions.registerFailure({error})]);
    });
  });

  describe('refresh token', () => {
    it('emits refreshTokenSuccess and persists the refreshed user', async () => {
      service.refreshToken.and.returnValue(of(user));

      expect(await ctx.emitted(ctx.effects.refreshToken$, AuthActions.refreshToken({data: 'old'})))
        .toEqual([AuthActions.refreshTokenSuccess({data: user})]);

      await ctx.emitted(ctx.effects.refreshTokenSuccess$, AuthActions.refreshTokenSuccess({data: user}));

      expect(service.saveLoginStateToLocalStorage).toHaveBeenCalledOnceWith(user);
    });
  });

  it('logout clears the stored user and goes to the login page', async () => {
    const result = await ctx.emitted(ctx.effects.logout$, AuthActions.logout());

    expect(result).toEqual([AuthActions.logoutSuccess()]);
    expect(service.saveLoginStateToLocalStorage).toHaveBeenCalledOnceWith(null);
    expect(ctx.router.navigateByUrl).toHaveBeenCalledOnceWith('/login');
  });
});
