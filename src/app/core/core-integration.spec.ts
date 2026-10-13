import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { firstValueFrom, lastValueFrom } from 'rxjs';

import { APP_ROUTES } from './config/app-routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { MOCK_API_DELAY, mockApiInterceptor } from './interceptors/mock-api.interceptor';
import { MOCK_CREDENTIALS } from './mocks/mock-data';
import { AuthService } from './services/auth.service';
import { ProductsService } from './services/products.service';
import { SessionStore } from './services/session.store';
import { UserService } from './services/user.service';

describe('Core integration with the mock API', () => {
  const router = { navigateByUrl: vi.fn().mockResolvedValue(true) };

  beforeEach(() => {
    router.navigateByUrl.mockClear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor, errorInterceptor, mockApiInterceptor])),
        { provide: MOCK_API_DELAY, useValue: () => 0 },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('should sign in and then load the user and the products with the token', async () => {
    await firstValueFrom(TestBed.inject(AuthService).signIn(MOCK_CREDENTIALS));

    const user = await firstValueFrom(TestBed.inject(UserService).loadUser());
    const [accounts, creditCards] = await lastValueFrom(TestBed.inject(ProductsService).loadGroups());

    expect(user.fullName).toBe('José Pérez');
    expect(accounts.status).toBe('loaded');
    expect(accounts.products.map((account) => account.displayName)).toEqual([
      'Cuenta de ahorros 1 - 0001',
      'Cuenta de ahorros 2 - 0002',
    ]);
    expect(creditCards.status).toBe('loaded');
    expect(creditCards.products.map((card) => card.balances.length)).toEqual([2, 1]);
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should reject wrong credentials without starting a session', async () => {
    const signIn = firstValueFrom(TestBed.inject(AuthService).signIn({ userId: '00100010321', password: '0000' }));

    await expect(signIn).rejects.toMatchObject({ status: 401 });
    expect(TestBed.inject(SessionStore).isAuthenticated()).toBe(false);
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should send the user to login when a protected request has no token', async () => {
    const groups = await lastValueFrom(TestBed.inject(ProductsService).loadGroups());

    expect(groups.map((group) => group.status)).toEqual(['error', 'error']);
    expect(router.navigateByUrl).toHaveBeenCalledWith(APP_ROUTES.login);
  });
});
