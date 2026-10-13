import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints';
import { UserDto } from '../models/api.dto';
import { User } from '../models/user.model';
import { SessionStore } from './session.store';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(SessionStore);

  loadUser(): Observable<User> {
    return this.http.get<UserDto>(API_ENDPOINTS.user).pipe(
      map((dto) => new User(dto.name, dto.lastName, dto.photo)),
      tap((user) => this.session.setUser(user)),
    );
  }
}
