import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints';
import { SignInResponseDto } from '../models/api.dto';
import { AuthTokens, Credentials } from '../models/auth-tokens.model';
import { SessionStore } from './session.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(SessionStore);

  signIn(credentials: Credentials): Observable<void> {
    return this.http.post<SignInResponseDto>(API_ENDPOINTS.signIn, credentials).pipe(
      map((dto): AuthTokens => ({ accessToken: dto.access_token, refreshToken: dto.refresh_token })),
      tap((tokens) => this.session.start(tokens)),
      map(() => undefined),
    );
  }

  signOut(): void {
    this.session.clear();
  }
}
