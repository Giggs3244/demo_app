import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { API_ENDPOINTS } from '../config/api-endpoints';
import { SessionStore } from '../services/session.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const accessToken = inject(SessionStore).accessToken();

  if (req.url === API_ENDPOINTS.signIn || accessToken === null) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } }));
};
