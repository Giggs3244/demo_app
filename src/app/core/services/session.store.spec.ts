import { TestBed } from '@angular/core/testing';

import { User } from '../models/user.model';
import { SessionStore } from './session.store';

describe('SessionStore', () => {
  let store: SessionStore;

  beforeEach(() => {
    store = TestBed.inject(SessionStore);
  });

  it('should start without a session', () => {
    expect(store.isAuthenticated()).toBe(false);
    expect(store.accessToken()).toBeNull();
    expect(store.user()).toBeNull();
  });

  it('should be authenticated after starting a session', () => {
    store.start({ accessToken: 'access', refreshToken: 'refresh' });

    expect(store.isAuthenticated()).toBe(true);
    expect(store.accessToken()).toBe('access');
  });

  it('should keep the user', () => {
    const user = new User('José', 'Pérez', 'photo.jpg');

    store.setUser(user);

    expect(store.user()).toBe(user);
  });

  it('should drop tokens and user when cleared', () => {
    store.start({ accessToken: 'access', refreshToken: 'refresh' });
    store.setUser(new User('José', 'Pérez', 'photo.jpg'));

    store.clear();

    expect(store.isAuthenticated()).toBe(false);
    expect(store.user()).toBeNull();
  });
});
