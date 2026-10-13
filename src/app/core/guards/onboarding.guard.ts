import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { APP_ROUTES } from '../config/app-routes';
import { UserPreferencesService } from '../services/user-preferences.service';

export const onboardingGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const hasSeenOnboarding = await inject(UserPreferencesService).hasSeenOnboarding();

  return hasSeenOnboarding || router.parseUrl(APP_ROUTES.onboarding);
};
