import { Injectable } from '@angular/core';

import { StorageService } from '../services/storage.service';

@Injectable()
export class InMemoryStorageService extends StorageService {
  private readonly entries = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.entries.get(key) ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    this.entries.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.entries.delete(key);
  }
}
