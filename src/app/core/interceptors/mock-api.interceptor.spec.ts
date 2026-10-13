import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints';
import { MOCK_ACCOUNTS, MOCK_CREDENTIALS, MOCK_CREDIT_CARDS, MOCK_SIGN_IN_RESPONSE, MOCK_USER } from '../mocks/mock-data';
import { MOCK_API_DELAY, mockApiInterceptor, pickRandomDelay } from './mock-api.interceptor';

describe('mockApiInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  const authorized = { headers: { Authorization: `Bearer ${MOCK_SIGN_IN_RESPONSE.access_token}` } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([mockApiInterceptor])),
        provideHttpClientTesting(),
        { provide: MOCK_API_DELAY, useValue: () => 0 },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should return the tokens for valid credentials', async () => {
    const response = await firstValueFrom(http.post(API_ENDPOINTS.signIn, MOCK_CREDENTIALS));

    expect(response).toEqual(MOCK_SIGN_IN_RESPONSE);
  });

  it('should answer 401 for invalid credentials', async () => {
    const request = firstValueFrom(http.post(API_ENDPOINTS.signIn, { userId: '00100010321', password: 'wrong' }));

    await expect(request).rejects.toMatchObject({ status: 401 });
  });

  it('should answer 401 for a sign in without body', async () => {
    await expect(firstValueFrom(http.post(API_ENDPOINTS.signIn, null))).rejects.toMatchObject({ status: 401 });
  });

  it.each([
    ['user', API_ENDPOINTS.user, MOCK_USER],
    ['accounts', API_ENDPOINTS.accounts, MOCK_ACCOUNTS],
    ['credit cards', API_ENDPOINTS.creditCards, MOCK_CREDIT_CARDS],
  ])('should return the %s for an authorized request', async (_name, url, expected) => {
    expect(await firstValueFrom(http.get(url, authorized))).toEqual(expected);
  });

  it.each([API_ENDPOINTS.user, API_ENDPOINTS.accounts, API_ENDPOINTS.creditCards])(
    'should answer 401 for %s without token',
    async (url) => {
      await expect(firstValueFrom(http.get(url))).rejects.toMatchObject({ status: 401 });
    },
  );

  it('should answer 401 for a wrong token', async () => {
    const request = firstValueFrom(http.get(API_ENDPOINTS.accounts, { headers: { Authorization: 'Bearer other' } }));

    await expect(request).rejects.toMatchObject({ status: 401 });
  });

  it('should let unknown requests reach the backend', () => {
    http.get('/api/unknown').subscribe();

    httpMock.expectOne('/api/unknown').flush({});
  });
});

describe('mockApiInterceptor delay', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it.each([
    [0, 1000],
    [0.34, 2000],
    [0.99, 3000],
  ])('should pick a delay from the options when random is %s', (random, expected) => {
    vi.spyOn(Math, 'random').mockReturnValue(random);

    expect(pickRandomDelay([1000, 2000, 3000])).toBe(expected);
  });

  it('should fall back to no delay without options', () => {
    expect(pickRandomDelay([])).toBe(0);
  });

  it('should hold the response for the time given by the delay strategy', async () => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([mockApiInterceptor])),
        provideHttpClientTesting(),
        { provide: MOCK_API_DELAY, useValue: () => 2000 },
      ],
    });
    const onResponse = vi.fn();

    TestBed.inject(HttpClient).post(API_ENDPOINTS.signIn, MOCK_CREDENTIALS).subscribe(onResponse);

    await vi.advanceTimersByTimeAsync(1999);
    expect(onResponse).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(onResponse).toHaveBeenCalledWith(MOCK_SIGN_IN_RESPONSE);
  });
});
