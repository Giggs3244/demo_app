import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideIonicAngular } from '@ionic/angular';
import { NEVER, of } from 'rxjs';

import { routes } from '../../app.routes';
import { ProductFactory } from '../../core/mappers/product.factory';
import { MOCK_ACCOUNTS, MOCK_CREDIT_CARDS } from '../../core/mocks/mock-data';
import { ProductGroup } from '../../core/models/product-group.model';
import { ProductsService } from '../../core/services/products.service';
import { ProductsStore } from '../../core/services/products.store';
import { SessionStore } from '../../core/services/session.store';
import { StorageService } from '../../core/services/storage.service';
import { UserPreferencesService } from '../../core/services/user-preferences.service';
import { UserService } from '../../core/services/user.service';
import { InMemoryStorageService } from '../../core/testing/in-memory-storage.service';
import { ProductDetailPage } from './product-detail.page';

describe('Product detail navigation', () => {
  let harness: RouterTestingHarness;

  const groups: readonly ProductGroup[] = [
    { type: 'AC', status: 'loaded', products: MOCK_ACCOUNTS.map((dto) => ProductFactory.create(dto)) },
    { type: 'TC', status: 'loaded', products: MOCK_CREDIT_CARDS.map((dto) => ProductFactory.create(dto)) },
  ];

  const signInWithProducts = (): void => {
    TestBed.inject(SessionStore).start({ accessToken: 'access', refreshToken: 'refresh' });
    TestBed.inject(ProductsStore).load();
  };

  const currentPage = (): string => harness.routeNativeElement?.tagName.toLowerCase() ?? '';

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideIonicAngular({ mode: 'md' }),
        { provide: ProductsService, useValue: { loadGroups: () => of(groups) } },
        { provide: UserService, useValue: { loadUser: () => NEVER } },
        { provide: StorageService, useClass: InMemoryStorageService },
      ],
    });
    await TestBed.inject(UserPreferencesService).markOnboardingAsSeen();
    harness = await RouterTestingHarness.create();
  });

  it('should send a visitor without session to the login', async () => {
    await harness.navigateByUrl('/product/AC/0001');

    expect(currentPage()).toBe('app-login');
  });

  it('should go back to the products when the product is not loaded', async () => {
    TestBed.inject(SessionStore).start({ accessToken: 'access', refreshToken: 'refresh' });

    await harness.navigateByUrl('/product/AC/0001');

    expect(currentPage()).toBe('app-tabs');
  });

  it('should go back to the products for an unknown product', async () => {
    signInWithProducts();

    await harness.navigateByUrl('/product/AC/9999');

    expect(currentPage()).toBe('app-tabs');
  });

  it('should show the chosen account received through the route', async () => {
    signInWithProducts();

    await harness.navigateByUrl('/product/AC/0002', ProductDetailPage);
    await harness.fixture.whenStable();
    const page = harness.routeNativeElement;

    expect(page?.querySelector('ion-title')?.textContent?.trim()).toBe('Detalle de producto');
    expect(page?.querySelector('.card__alias')?.textContent).toBe('Cuenta de ahorros 2 - 0002');
    expect(page?.querySelector('.card__balance')?.textContent?.trim()).toBe('RD$ 200,000.00');
  });

  it('should show the chosen credit card with both balances', async () => {
    signInWithProducts();

    await harness.navigateByUrl('/product/TC/0001', ProductDetailPage);
    await harness.fixture.whenStable();
    const balances = [...(harness.routeNativeElement?.querySelectorAll('.card__balance') ?? [])];

    expect(harness.routeNativeElement?.querySelector('.card__alias')?.textContent).toBe('Tarjeta de crédito 1 - 0001');
    expect(balances.map((balance) => balance.textContent?.trim())).toEqual(['RD$ 1,000,000.00', 'US$ 1,000.00']);
  });

  it('should offer a back button to the products and the explanatory texts', async () => {
    signInWithProducts();

    await harness.navigateByUrl('/product/AC/0001', ProductDetailPage);
    await harness.fixture.whenStable();
    const page = harness.routeNativeElement;

    expect(page?.querySelector('ion-back-button')?.defaultHref).toBe('/tabs/products');
    expect(page?.querySelector('.placeholder__title')?.textContent).toBe('Pantalla\nde detalle de producto');
    expect(page?.querySelector('.placeholder__description')?.textContent).toContain('paso de datos entre pantallas');
  });
});
