import {TestBed} from '@angular/core/testing';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {Router} from '@angular/router';
import {tokenInterceptor} from './token-interceptor.service';
import {environment} from '../../environments/environment';
import {testProviders} from '@app/testing/test-providers';
import {fakeToken} from '@app/testing/fake-token';

describe('tokenInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let router: Router;

  const api = environment.webserviceurl;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        ...testProviders,
        provideHttpClient(withInterceptors([tokenInterceptor])),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.resolveTo(true);
  });

  afterEach(() => {
    controller.verify();
    localStorage.clear();
  });

  it('adds the bearer token to API requests', () => {
    const token = fakeToken(3600);
    localStorage.setItem('user', JSON.stringify({username: 'u', password: '', token}));

    http.get(`${api}/ShoppingList`).subscribe();

    const request = controller.expectOne(`${api}/ShoppingList`);
    expect(request.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    request.flush([]);
  });

  it('does not add a token to public auth requests', () => {
    http.post(`${api}/User/login`, {}).subscribe();

    const request = controller.expectOne(`${api}/User/login`);
    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush({});
  });

  it('does not touch requests to other hosts', () => {
    http.get('https://example.org/data').subscribe();

    const request = controller.expectOne('https://example.org/data');
    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush({});
  });

  it('redirects to /login and fails the request when there is no valid token', () => {
    let failed = false;

    http.get(`${api}/ShoppingList`).subscribe({error: () => failed = true});

    controller.expectNone(`${api}/ShoppingList`);
    expect(failed).toBeTrue();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
