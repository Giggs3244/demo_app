import { Injectable, computed, signal } from '@angular/core';

import { AuthTokens } from '../models/auth-tokens.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly tokensState = signal<AuthTokens | null>(null);
  private readonly userState = signal<User | null>(null);

  readonly user = this.userState.asReadonly();
  readonly accessToken = computed(() => this.tokensState()?.accessToken ?? null);
  readonly isAuthenticated = computed(() => this.accessToken() !== null);

  start(tokens: AuthTokens): void {
    this.tokensState.set(tokens);
  }

  setUser(user: User): void {
    this.userState.set(user);
  }

  clear(): void {
    this.tokensState.set(null);
    this.userState.set(null);
  }
}
