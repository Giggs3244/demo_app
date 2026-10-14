import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { ProductFactory } from '../mappers/product.factory';
import { MOCK_ACCOUNTS, MOCK_CREDIT_CARDS } from '../mocks/mock-data';
import { ProductGroup } from '../models/product-group.model';
import { ProductsService } from './products.service';
import { ProductsStore } from './products.store';
import { SessionStore } from './session.store';

describe('ProductsStore', () => {
  let store: ProductsStore;
  let session: SessionStore;
  let responses: Subject<readonly ProductGroup[]>[];

  const accounts = MOCK_ACCOUNTS.map((dto) => ProductFactory.create(dto));
  const creditCards = MOCK_CREDIT_CARDS.map((dto) => ProductFactory.create(dto));
  const loaded: readonly ProductGroup[] = [
    { type: 'AC', status: 'loaded', products: accounts },
    { type: 'TC', status: 'loaded', products: creditCards },
  ];

  beforeEach(() => {
    responses = [];
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ProductsService,
          useValue: {
            loadGroups: () => {
              const response = new Subject<readonly ProductGroup[]>();
              responses.push(response);
              return response;
            },
          },
        },
      ],
    });
    session = TestBed.inject(SessionStore);
    session.start({ accessToken: 'access', refreshToken: 'refresh' });
    store = TestBed.inject(ProductsStore);
  });

  it('should start empty', () => {
    expect(store.groups()).toEqual([]);
  });

  it('should publish every update of the groups while loading', () => {
    const partial: readonly ProductGroup[] = [
      { type: 'AC', status: 'loading', products: [] },
      { type: 'TC', status: 'loaded', products: creditCards },
    ];

    store.load();
    responses[0].next(partial);
    expect(store.groups()).toBe(partial);

    responses[0].next(loaded);
    expect(store.groups()).toBe(loaded);
  });

  it('should ignore a previous load once a new one starts', () => {
    store.load();
    store.load();

    responses[0].next(loaded);
    expect(store.groups()).toEqual([]);

    responses[1].next(loaded);
    expect(store.groups()).toBe(loaded);
  });

  it('should find a product by type and last digits', () => {
    store.load();
    responses[0].next(loaded);

    expect(store.find('AC', '0002')).toBe(accounts[1]);
    expect(store.find('TC', '0001')).toBe(creditCards[0]);
  });

  it('should not mix products of different types with the same digits', () => {
    store.load();
    responses[0].next([{ type: 'AC', status: 'loaded', products: accounts }]);

    expect(store.find('TC', '0001')).toBeUndefined();
  });

  it('should not find anything before loading or for unknown digits', () => {
    expect(store.find('AC', '0001')).toBeUndefined();

    store.load();
    responses[0].next(loaded);

    expect(store.find('AC', '9999')).toBeUndefined();
  });

  it('should drop the products and stop listening when the session ends', () => {
    store.load();
    responses[0].next(loaded);

    session.clear();
    TestBed.tick();

    expect(store.groups()).toEqual([]);
    expect(responses[0].observed).toBe(false);
  });
});
