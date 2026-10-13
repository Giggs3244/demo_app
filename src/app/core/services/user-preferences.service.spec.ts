import { TestBed } from '@angular/core/testing';

import { InMemoryStorageService } from '../testing/in-memory-storage.service';
import { StorageService } from './storage.service';
import { UserPreferencesService } from './user-preferences.service';

describe('UserPreferencesService', () => {
  let preferences: UserPreferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useClass: InMemoryStorageService }],
    });
    preferences = TestBed.inject(UserPreferencesService);
  });

  it('should have no remembered user by default', async () => {
    expect(await preferences.getRememberedUserId()).toBeNull();
  });

  it('should remember and forget the user id', async () => {
    await preferences.rememberUserId('00100010321');
    expect(await preferences.getRememberedUserId()).toBe('00100010321');

    await preferences.forgetUserId();
    expect(await preferences.getRememberedUserId()).toBeNull();
  });

  it('should report the onboarding as not seen by default', async () => {
    expect(await preferences.hasSeenOnboarding()).toBe(false);
  });

  it('should report the onboarding as seen once marked', async () => {
    await preferences.markOnboardingAsSeen();

    expect(await preferences.hasSeenOnboarding()).toBe(true);
  });
});
