import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_ENDPOINTS } from '../config/api-endpoints';
import { SessionStore } from '../services/session.store';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let session: SessionStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    session = TestBed.inject(SessionStore);
  });

  afterEach(() => httpMock.verify());

  it('should add the bearer token when there is a session', () => {
    session.start({ accessToken: 'token-123', refreshToken: 'refresh' });

    http.get(API_ENDPOINTS.accounts).subscribe();

    const request = httpMock.expectOne(API_ENDPOINTS.accounts);
    expect(request.request.headers.get('Authorization')).toBe('Bearer token-123');
    request.flush([]);
  });

  it('should not add the header without a session', () => {
    http.get(API_ENDPOINTS.accounts).subscribe();

    const request = httpMock.expectOne(API_ENDPOINTS.accounts);
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush([]);
  });

  it('should not add the header to the sign in request', () => {
    session.start({ accessToken: 'token-123', refreshToken: 'refresh' });

    http.post(API_ENDPOINTS.signIn, {}).subscribe();

    const request = httpMock.expectOne(API_ENDPOINTS.signIn);
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });
});
