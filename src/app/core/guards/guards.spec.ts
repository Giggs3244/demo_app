import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, Router, RouterStateSnapshot, provideRouter } from '@angular/router';

import { APP_ROUTES } from '../config/app-routes';
import { SessionStore } from '../services/session.store';
import { StorageService } from '../services/storage.service';
import { UserPreferencesService } from '../services/user-preferences.service';
import { InMemoryStorageService } from '../testing/in-memory-storage.service';
import { authGuard } from './auth.guard';
import { guestGuard } from './guest.guard';
import { onboardingGuard } from './onboarding.guard';

describe('Route guards', () => {
  let session: SessionStore;
  let router: Router;

  const run = (guard: typeof authGuard): MaybeAsync<GuardResult> =>
    TestBed.runInInjectionContext(() => guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: StorageService, useClass: InMemoryStorageService }],
    });
    session = TestBed.inject(SessionStore);
    router = TestBed.inject(Router);
  });

  describe('authGuard', () => {
    it('should redirect to login without a session', () => {
      expect(run(authGuard)).toEqual(router.parseUrl(APP_ROUTES.login));
    });

    it('should allow the navigation with a session', () => {
      session.start({ accessToken: 'access', refreshToken: 'refresh' });

      expect(run(authGuard)).toBe(true);
    });
  });

  describe('guestGuard', () => {
    it('should allow the navigation without a session', () => {
      expect(run(guestGuard)).toBe(true);
    });

    it('should redirect to products with a session', () => {
      session.start({ accessToken: 'access', refreshToken: 'refresh' });

      expect(run(guestGuard)).toEqual(router.parseUrl(APP_ROUTES.products));
    });
  });

  describe('onboardingGuard', () => {
    it('should redirect to the onboarding the first time', async () => {
      expect(await run(onboardingGuard)).toEqual(router.parseUrl(APP_ROUTES.onboarding));
    });

    it('should allow the navigation once the onboarding was seen', async () => {
      await TestBed.inject(UserPreferencesService).markOnboardingAsSeen();

      expect(await run(onboardingGuard)).toBe(true);
    });
  });
});
