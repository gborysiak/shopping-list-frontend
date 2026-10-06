import {TestBed} from '@angular/core/testing';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {authGuard} from './auth-guard';
import {roleGuard} from './role-guard';
import {testProviders} from '@app/testing/test-providers';
import {fakeToken} from '@app/testing/fake-token';

describe('route guards', () => {
  let router: Router;

  const storeUser = (roles: string[], expiresInSeconds = 3600) =>
    localStorage.setItem('user', JSON.stringify({
      username: 'u',
      password: '',
      token: fakeToken(expiresInSeconds),
      roles: roles.map(name => ({name}))
    }));

  const run = (guard: typeof authGuard, expectedRole?: string) => {
    const route = {data: {expectedRole}} as unknown as ActivatedRouteSnapshot;
    return TestBed.runInInjectionContext(() => guard(route, {} as RouterStateSnapshot));
  };

  const urlOf = (result: unknown) => router.serializeUrl(result as UrlTree);

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({providers: testProviders});
    router = TestBed.inject(Router);
  });

  afterEach(() => localStorage.clear());

  describe('authGuard', () => {
    it('lets a logged-in user through', () => {
      storeUser([]);

      expect(run(authGuard)).toBeTrue();
    });

    it('redirects to /login when nobody is logged in', () => {
      expect(urlOf(run(authGuard))).toBe('/login');
    });

    it('redirects to /login when the token is expired', () => {
      storeUser([], -60);

      expect(urlOf(run(authGuard))).toBe('/login');
    });
  });

  describe('roleGuard', () => {
    it('lets a user with the expected role through', () => {
      storeUser(['ROLE_ADMIN']);

      expect(run(roleGuard, 'ROLE_ADMIN')).toBeTrue();
    });

    it('redirects to /home when the role is missing', () => {
      storeUser(['ROLE_USER']);

      expect(urlOf(run(roleGuard, 'ROLE_ADMIN'))).toBe('/home');
    });

    it('redirects to /login when the token is expired', () => {
      storeUser(['ROLE_ADMIN'], -60);

      expect(urlOf(run(roleGuard, 'ROLE_ADMIN'))).toBe('/login');
    });
  });
});
