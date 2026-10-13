import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { APP_ROUTES } from '../config/app-routes';
import { SessionStore } from '../services/session.store';

export const authGuard: CanActivateFn = () =>
  inject(SessionStore).isAuthenticated() || inject(Router).parseUrl(APP_ROUTES.login);
