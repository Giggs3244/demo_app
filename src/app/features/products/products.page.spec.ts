import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

import { ProductFactory } from '../../core/mappers/product.factory';
import { MOCK_ACCOUNTS, MOCK_CREDIT_CARDS } from '../../core/mocks/mock-data';
import { ProductGroup, ProductGroupStatus } from '../../core/models/product-group.model';
import { Product, ProductType } from '../../core/models/product.model';
import { ProductsService } from '../../core/services/products.service';
import { SessionStore } from '../../core/services/session.store';
import { ProductsPage } from './products.page';

describe('ProductsPage', () => {
  let fixture: ComponentFixture<ProductsPage>;
  let element: HTMLElement;
  let groups: BehaviorSubject<readonly ProductGroup[]>;

  const accounts = MOCK_ACCOUNTS.map((dto) => ProductFactory.create(dto));
  const creditCards = MOCK_CREDIT_CARDS.map((dto) => ProductFactory.create(dto));

  const group = (type: ProductType, status: ProductGroupStatus, products: readonly Product[] = []): ProductGroup => ({
    type,
    status,
    products,
  });

  const emit = async (...next: ProductGroup[]): Promise<void> => {
    groups.next(next);
    await fixture.whenStable();
  };

  const layout = (): string[] =>
    [...element.querySelectorAll('main.products > *')].map((child) =>
      child.tagName === 'SECTION' ? (child.querySelector('h2')?.textContent?.trim() ?? '') : 'skeleton',
    );

  const cardNames = (): string[] =>
    [...element.querySelectorAll('.card__alias')].map((alias) => alias.textContent?.trim() ?? '');

  beforeEach(async () => {
    groups = new BehaviorSubject<readonly ProductGroup[]>([group('AC', 'loading'), group('TC', 'loading')]);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideIonicAngular({ mode: 'md' }),
        { provide: ProductsService, useValue: { loadGroups: () => groups } },
      ],
    });
    TestBed.inject(SessionStore).start({ accessToken: 'access', refreshToken: 'refresh' });
    fixture = TestBed.createComponent(ProductsPage);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should show the page title', () => {
    expect(element.querySelector('ion-title')?.textContent?.trim()).toBe('Mis productos');
  });

  it('should show a single skeleton while everything is loading', () => {
    expect(layout()).toEqual(['skeleton']);
    expect(element.querySelectorAll('app-product-card')).toHaveLength(0);
  });

  it('should replace the skeleton with the accounts and keep waiting for the credit cards', async () => {
    await emit(group('AC', 'loaded', accounts), group('TC', 'loading'));

    expect(layout()).toEqual(['CUENTAS (2)', 'skeleton']);
    expect(cardNames()).toEqual(['Cuenta de ahorros 1 - 0001', 'Cuenta de ahorros 2 - 0002']);
  });

  it('should keep the skeleton in the accounts place when the credit cards arrive first', async () => {
    await emit(group('AC', 'loading'), group('TC', 'loaded', creditCards));

    expect(layout()).toEqual(['skeleton', 'TARJETAS (2)']);
  });

  it('should show accounts first and no skeleton once everything is loaded', async () => {
    await emit(group('AC', 'loaded', accounts), group('TC', 'loaded', creditCards));

    expect(layout()).toEqual(['CUENTAS (2)', 'TARJETAS (2)']);
    expect(cardNames()).toEqual([
      'Cuenta de ahorros 1 - 0001',
      'Cuenta de ahorros 2 - 0002',
      'Tarjeta de crédito 1 - 0001',
      'Tarjeta de crédito 2 - 0002',
    ]);
  });

  it('should link every card to its detail using only the last digits', async () => {
    await emit(group('AC', 'loaded', accounts), group('TC', 'loaded', creditCards));

    const links = [...element.querySelectorAll('.products__link')];

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/product/AC/0001',
      '/product/AC/0002',
      '/product/TC/0001',
      '/product/TC/0002',
    ]);
    expect(links.every((link) => link.getAttribute('routerDirection') === 'forward')).toBe(true);
    expect(links.every((link) => link.querySelector('app-product-card') !== null)).toBe(true);
  });

  it('should color each group title with its product accent', async () => {
    await emit(group('AC', 'loaded', accounts), group('TC', 'loaded', creditCards));

    const [accountsGroup, cardsGroup] = element.querySelectorAll('section');

    expect(accountsGroup.classList).toContain('products__group--primary');
    expect(cardsGroup.classList).toContain('products__group--secondary');
  });

  it('should not render a group without products', async () => {
    await emit(group('AC', 'loaded', accounts), group('TC', 'loaded', []));

    expect(layout()).toEqual(['CUENTAS (2)']);
  });

  it('should not render a failed group nor leave the skeleton behind', async () => {
    await emit(group('AC', 'error'), group('TC', 'loaded', creditCards));

    expect(layout()).toEqual(['TARJETAS (2)']);
  });

  it('should render nothing when the user has no products', async () => {
    await emit(group('AC', 'loaded', []), group('TC', 'loaded', []));

    expect(layout()).toEqual([]);
  });
});
