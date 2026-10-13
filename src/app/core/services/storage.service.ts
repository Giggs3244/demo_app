import { Injectable, forwardRef } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root', useExisting: forwardRef(() => PreferencesStorageService) })
export abstract class StorageService {
  abstract get(key: string): Promise<string | null>;
  abstract set(key: string, value: string): Promise<void>;
  abstract remove(key: string): Promise<void>;
}

@Injectable({ providedIn: 'root' })
export class PreferencesStorageService extends StorageService {
  async get(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key });

    return value;
  }

  set(key: string, value: string): Promise<void> {
    return Preferences.set({ key, value });
  }

  remove(key: string): Promise<void> {
    return Preferences.remove({ key });
  }
}
