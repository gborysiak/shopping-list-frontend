import {TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {AuthService} from './auth.service';
import {AuthActions} from '@app/store/auth/auth.actions';
import {User} from '@app/entities/user';
import {testProviders} from '@app/testing/test-providers';
import {fakeToken} from '@app/testing/fake-token';

describe('AuthService', () => {
  let service: AuthService;
  let store: Store;

  const storeUser = (user: Partial<User>) =>
    localStorage.setItem('user', JSON.stringify({username: 'u', password: '', ...user}));

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({providers: testProviders});
    service = TestBed.inject(AuthService);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');
  });

  afterEach(() => localStorage.clear());

  describe('isLoginStateValid', () => {
    it('is false when nobody is stored', () => {
      expect(service.isLoginStateValid()).toBeFalse();
    });

    it('is true for a stored user with a valid token', () => {
      storeUser({token: fakeToken(3600)});

      expect(service.isLoginStateValid()).toBeTrue();
    });

    it('is false and clears the storage when the token is expired', () => {
      storeUser({token: fakeToken(-60)});

      expect(service.isLoginStateValid()).toBeFalse();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('is false and clears the storage when the stored value is corrupt', () => {
      localStorage.setItem('user', '{not json');

      expect(service.isLoginStateValid()).toBeFalse();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('has no side effect on the store', () => {
      storeUser({token: fakeToken(3600)});

      service.isLoginStateValid();

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('restoreLoginState', () => {
    it('puts a valid stored user back into the store', () => {
      const token = fakeToken(3600);
      storeUser({token});

      service.restoreLoginState();

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.loginLocalstorage({data: jasmine.objectContaining({token}) as unknown as User})
      );
    });

    it('does nothing when the token is expired', () => {
      storeUser({token: fakeToken(-60)});

      service.restoreLoginState();

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('getAllRolesOfLoggedInUser', () => {
    it('returns only known role names', () => {
      storeUser({token: fakeToken(3600), roles: [{name: 'ROLE_ADMIN'}, {name: 'SOMETHING_ELSE'}]});

      expect(service.getAllRolesOfLoggedInUser()).toEqual(['ROLE_ADMIN']);
    });

    it('returns an empty list when nobody is stored', () => {
      expect(service.getAllRolesOfLoggedInUser()).toEqual([]);
    });
  });

  it('getActiveLoginToken returns the stored token or an empty string', () => {
    expect(service.getActiveLoginToken()).toBe('');

    storeUser({token: 'abc'});
    expect(service.getActiveLoginToken()).toBe('abc');
  });
});
