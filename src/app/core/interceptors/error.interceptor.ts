import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints';
import { APP_ROUTES } from '../config/app-routes';
import { SessionStore } from '../services/session.store';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionStore);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      const isExpiredSession =
        error instanceof HttpErrorResponse &&
        error.status === HttpStatusCode.Unauthorized &&
        req.url !== API_ENDPOINTS.signIn;

      if (isExpiredSession) {
        session.clear();
        void router.navigateByUrl(APP_ROUTES.login);
      }

      return throwError(() => error);
    }),
  );
};
