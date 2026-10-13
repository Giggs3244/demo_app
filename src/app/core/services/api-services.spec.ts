import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints';
import { MOCK_ACCOUNTS, MOCK_CREDENTIALS, MOCK_CREDIT_CARDS, MOCK_SIGN_IN_RESPONSE, MOCK_USER } from '../mocks/mock-data';
import { Account } from '../models/account.model';
import { CreditCard } from '../models/credit-card.model';
import { ProductGroup } from '../models/product-group.model';
import { ProductType } from '../models/product.model';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { ProductsService } from './products.service';
import { SessionStore } from './session.store';
import { UserService } from './user.service';

describe('API services', () => {
  let httpMock: HttpTestingController;
  let session: SessionStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    session = TestBed.inject(SessionStore);
  });

  afterEach(() => httpMock.verify());

  describe('AuthService', () => {
    it('should post the credentials and start the session', async () => {
      const result = firstValueFrom(TestBed.inject(AuthService).signIn(MOCK_CREDENTIALS));

      const request = httpMock.expectOne(API_ENDPOINTS.signIn);
      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual(MOCK_CREDENTIALS);
      request.flush(MOCK_SIGN_IN_RESPONSE);

      await result;
      expect(session.isAuthenticated()).toBe(true);
      expect(session.accessToken()).toBe(MOCK_SIGN_IN_RESPONSE.access_token);
    });

    it('should not start the session when the sign in fails', async () => {
      const result = firstValueFrom(TestBed.inject(AuthService).signIn({ userId: 'x', password: 'y' }));

      httpMock.expectOne(API_ENDPOINTS.signIn).flush(null, { status: 401, statusText: 'Unauthorized' });

      await expect(result).rejects.toMatchObject({ status: 401 });
      expect(session.isAuthenticated()).toBe(false);
    });

    it('should clear the session on sign out', () => {
      session.start({ accessToken: 'access', refreshToken: 'refresh' });

      TestBed.inject(AuthService).signOut();

      expect(session.isAuthenticated()).toBe(false);
    });
  });

  describe('UserService', () => {
    it('should map the user and keep it in the session', async () => {
      const result = firstValueFrom(TestBed.inject(UserService).loadUser());

      const request = httpMock.expectOne(API_ENDPOINTS.user);
      expect(request.request.method).toBe('GET');
      request.flush(MOCK_USER);

      const user = await result;
      expect(user).toBeInstanceOf(User);
      expect(user.fullName).toBe('José Pérez');
      expect(user.photoUrl).toBe(MOCK_USER.photo);
      expect(session.user()).toBe(user);
    });
  });

  describe('ProductsService', () => {
    const snapshot = (groups: readonly ProductGroup[]) =>
      groups.map((group) => `${group.type}:${group.status}:${group.products.length}`);

    const collectGroups = () => {
      const emissions: string[][] = [];
      const onComplete = vi.fn();

      TestBed.inject(ProductsService)
        .loadGroups()
        .subscribe({ next: (groups) => emissions.push(snapshot(groups)), complete: onComplete });

      return { emissions, onComplete };
    };

    it('should map accounts', async () => {
      const result = firstValueFrom(TestBed.inject(ProductsService).getProducts('AC'));

      httpMock.expectOne(API_ENDPOINTS.accounts).flush(MOCK_ACCOUNTS);

      const accounts = await result;
      expect(accounts).toHaveLength(2);
      expect(accounts[0]).toBeInstanceOf(Account);
      expect(accounts[1].displayName).toBe('Cuenta de ahorros 2 - 0002');
    });

    it('should map credit cards', async () => {
      const result = firstValueFrom(TestBed.inject(ProductsService).getProducts('TC'));

      httpMock.expectOne(API_ENDPOINTS.creditCards).flush(MOCK_CREDIT_CARDS);

      const cards = await result;
      expect(cards).toHaveLength(2);
      expect(cards[0]).toBeInstanceOf(CreditCard);
      expect(cards[1].balances).toHaveLength(1);
    });

    it('should reject a product type without a registered source', () => {
      expect(() => TestBed.inject(ProductsService).getProducts('XX' as ProductType)).toThrowError(
        'No product source registered for type: XX',
      );
    });

    it('should start every group as loading, accounts first, and request them in parallel', () => {
      const { emissions } = collectGroups();

      expect(emissions).toEqual([['AC:loading:0', 'TC:loading:0']]);

      httpMock.expectOne(API_ENDPOINTS.accounts).flush(MOCK_ACCOUNTS);
      httpMock.expectOne(API_ENDPOINTS.creditCards).flush(MOCK_CREDIT_CARDS);
    });

    it('should publish each group as soon as its response arrives', () => {
      const { emissions, onComplete } = collectGroups();
      const accountsRequest = httpMock.expectOne(API_ENDPOINTS.accounts);
      const cardsRequest = httpMock.expectOne(API_ENDPOINTS.creditCards);

      accountsRequest.flush(MOCK_ACCOUNTS);
      expect(emissions.at(-1)).toEqual(['AC:loaded:2', 'TC:loading:0']);
      expect(onComplete).not.toHaveBeenCalled();

      cardsRequest.flush(MOCK_CREDIT_CARDS);
      expect(emissions.at(-1)).toEqual(['AC:loaded:2', 'TC:loaded:2']);
      expect(onComplete).toHaveBeenCalledOnce();
    });

    it('should keep accounts first even when credit cards answer earlier', () => {
      const { emissions } = collectGroups();
      const accountsRequest = httpMock.expectOne(API_ENDPOINTS.accounts);
      const cardsRequest = httpMock.expectOne(API_ENDPOINTS.creditCards);

      cardsRequest.flush(MOCK_CREDIT_CARDS);
      expect(emissions.at(-1)).toEqual(['AC:loading:0', 'TC:loaded:2']);

      accountsRequest.flush(MOCK_ACCOUNTS);
      expect(emissions.at(-1)).toEqual(['AC:loaded:2', 'TC:loaded:2']);
    });

    it('should mark only the failing group as error', () => {
      const { emissions, onComplete } = collectGroups();
      const accountsRequest = httpMock.expectOne(API_ENDPOINTS.accounts);
      const cardsRequest = httpMock.expectOne(API_ENDPOINTS.creditCards);

      accountsRequest.flush(null, { status: 500, statusText: 'Server Error' });
      cardsRequest.flush(MOCK_CREDIT_CARDS);

      expect(emissions.at(-1)).toEqual(['AC:error:0', 'TC:loaded:2']);
      expect(onComplete).toHaveBeenCalledOnce();
    });
  });
});
