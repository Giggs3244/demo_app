import { TestBed } from '@angular/core/testing';
import { Preferences } from '@capacitor/preferences';

import { PreferencesStorageService, StorageService } from './storage.service';

describe('StorageService', () => {
  let storage: StorageService;

  beforeEach(async () => {
    await Preferences.clear();
    storage = TestBed.inject(StorageService);
  });

  it('should resolve to the Capacitor Preferences implementation', () => {
    expect(storage).toBeInstanceOf(PreferencesStorageService);
  });

  it('should return null for a missing key', async () => {
    expect(await storage.get('missing')).toBeNull();
  });

  it('should store and read a value', async () => {
    await storage.set('key', 'value');

    expect(await storage.get('key')).toBe('value');
  });

  it('should remove a value', async () => {
    await storage.set('key', 'value');

    await storage.remove('key');

    expect(await storage.get('key')).toBeNull();
  });
});
