import { Injectable, inject } from '@angular/core';

import { StorageService } from './storage.service';

const REMEMBERED_USER_KEY = 'rememberedUserId';
const ONBOARDING_SEEN_KEY = 'onboardingSeen';

@Injectable({ providedIn: 'root' })
export class UserPreferencesService {
  private readonly storage = inject(StorageService);

  getRememberedUserId(): Promise<string | null> {
    return this.storage.get(REMEMBERED_USER_KEY);
  }

  rememberUserId(userId: string): Promise<void> {
    return this.storage.set(REMEMBERED_USER_KEY, userId);
  }

  forgetUserId(): Promise<void> {
    return this.storage.remove(REMEMBERED_USER_KEY);
  }

  async hasSeenOnboarding(): Promise<boolean> {
    return (await this.storage.get(ONBOARDING_SEEN_KEY)) === 'true';
  }

  markOnboardingAsSeen(): Promise<void> {
    return this.storage.set(ONBOARDING_SEEN_KEY, 'true');
  }
}
