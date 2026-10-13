import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { API_ENDPOINTS } from '../config/api-endpoints';
import { APP_ROUTES } from '../config/app-routes';
import { SessionStore } from '../services/session.store';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let session: SessionStore;
  const router = { navigateByUrl: vi.fn().mockResolvedValue(true) };

  beforeEach(() => {
    router.navigateByUrl.mockClear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    session = TestBed.inject(SessionStore);
    session.start({ accessToken: 'access', refreshToken: 'refresh' });
  });

  afterEach(() => httpMock.verify());

  it('should end the session and go to login on a 401 from a protected endpoint', () => {
    const onError = vi.fn();

    http.get(API_ENDPOINTS.accounts).subscribe({ error: onError });
    httpMock.expectOne(API_ENDPOINTS.accounts).flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(session.isAuthenticated()).toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalledWith(APP_ROUTES.login);
    expect(onError).toHaveBeenCalledOnce();
  });

  it('should leave the session untouched on a 401 from the sign in endpoint', () => {
    const onError = vi.fn();

    http.post(API_ENDPOINTS.signIn, {}).subscribe({ error: onError });
    httpMock.expectOne(API_ENDPOINTS.signIn).flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(session.isAuthenticated()).toBe(true);
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledOnce();
  });

  it('should leave the session untouched on other errors', () => {
    const onError = vi.fn();

    http.get(API_ENDPOINTS.accounts).subscribe({ error: onError });
    httpMock.expectOne(API_ENDPOINTS.accounts).flush(null, { status: 500, statusText: 'Server Error' });

    expect(session.isAuthenticated()).toBe(true);
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledOnce();
  });
});
