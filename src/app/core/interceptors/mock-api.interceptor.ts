import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { InjectionToken, inject } from '@angular/core';
import { Observable, of, switchMap, throwError, timer } from 'rxjs';

import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../config/api-endpoints';
import {
  MOCK_ACCOUNTS,
  MOCK_CREDENTIALS,
  MOCK_CREDIT_CARDS,
  MOCK_SIGN_IN_RESPONSE,
  MOCK_USER,
} from '../mocks/mock-data';
import { CredentialsDto } from '../models/api.dto';

type MockHandler = (req: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>;

export type MockDelayStrategy = () => number;

export const pickRandomDelay = (delaysMs: readonly number[]): number =>
  delaysMs[Math.floor(Math.random() * delaysMs.length)] ?? 0;

export const MOCK_API_DELAY = new InjectionToken<MockDelayStrategy>('MOCK_API_DELAY', {
  providedIn: 'root',
  factory: () => () => pickRandomDelay(environment.mockDelaysMs),
});

const ok = (body: unknown): Observable<HttpEvent<unknown>> => of(new HttpResponse({ status: HttpStatusCode.Ok, body }));

const unauthorized = (req: HttpRequest<unknown>, message: string): Observable<never> =>
  throwError(
    () =>
      new HttpErrorResponse({
        status: HttpStatusCode.Unauthorized,
        statusText: 'Unauthorized',
        url: req.url,
        error: { message },
      }),
  );

const signIn: MockHandler = (req) => {
  const credentials = req.body as Partial<CredentialsDto> | null;
  const isValid =
    credentials?.userId === MOCK_CREDENTIALS.userId && credentials?.password === MOCK_CREDENTIALS.password;

  return isValid ? ok(MOCK_SIGN_IN_RESPONSE) : unauthorized(req, 'Invalid credentials');
};

const authenticated =
  (body: unknown): MockHandler =>
  (req) => {
    const expected = `Bearer ${MOCK_SIGN_IN_RESPONSE.access_token}`;

    return req.headers.get('Authorization') === expected ? ok(body) : unauthorized(req, 'Missing or invalid token');
  };

const MOCK_HANDLERS: Readonly<Record<string, MockHandler>> = {
  [`POST ${API_ENDPOINTS.signIn}`]: signIn,
  [`GET ${API_ENDPOINTS.user}`]: authenticated(MOCK_USER),
  [`GET ${API_ENDPOINTS.accounts}`]: authenticated(MOCK_ACCOUNTS),
  [`GET ${API_ENDPOINTS.creditCards}`]: authenticated(MOCK_CREDIT_CARDS),
};

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const handler = MOCK_HANDLERS[`${req.method} ${req.url}`];

  if (!handler) {
    return next(req);
  }

  const nextDelay = inject(MOCK_API_DELAY);

  return timer(nextDelay()).pipe(switchMap(() => handler(req)));
};
