import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Account } from '../../../core/models/account.model';
import { CreditCard } from '../../../core/models/credit-card.model';
import { Product } from '../../../core/models/product.model';
import { ProductCardComponent } from './product-card.component';

describe('ProductCardComponent', () => {
  let fixture: ComponentFixture<ProductCardComponent>;
  let element: HTMLElement;

  const render = async (product: Product): Promise<void> => {
    fixture.componentRef.setInput('product', product);
    await fixture.whenStable();
  };

  const balances = (): string[] =>
    [...element.querySelectorAll('.card__balance')].map((balance) => balance.textContent?.trim() ?? '');

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCardComponent);
    element = fixture.nativeElement;
  });

  it('should render an account with its name, balance and green accent', async () => {
    await render(new Account('Cuenta de ahorros 1', '1234567890001', 100000));

    expect(element.querySelector('.card__alias')?.textContent).toBe('Cuenta de ahorros 1 - 0001');
    expect(balances()).toEqual(['RD$ 100,000.00']);
    expect(element.querySelector('.card__caption')?.textContent).toBe('Balance disponible');
    expect(element.querySelector('.card')?.classList).toContain('card--primary');
    expect(element.querySelector('img')?.getAttribute('src')).toBe('assets/icons/save-money-40-gray.svg');
  });

  it('should emphasize only the whole part of the amount', async () => {
    await render(new Account('Cuenta', '1234567890001', 1234567.5));

    expect(element.querySelector('.card__amount')?.textContent).toBe('1,234,567');
    expect(balances()).toEqual(['RD$ 1,234,567.50']);
  });

  it('should render both balances of an international credit card with blue accent', async () => {
    await render(new CreditCard('Tarjeta de crédito 1', '0987 6543 2109 0001', 1000000, 1000, true));

    expect(element.querySelector('.card__alias')?.textContent).toBe('Tarjeta de crédito 1 - 0001');
    expect(balances()).toEqual(['RD$ 1,000,000.00', 'US$ 1,000.00']);
    expect(element.querySelector('.card')?.classList).toContain('card--secondary');
    expect(element.querySelector('img')?.getAttribute('src')).toBe('assets/icons/card-40-gray.svg');
  });

  it('should render only the local balance of a non international credit card', async () => {
    await render(new CreditCard('Tarjeta de crédito 2', '0987 6543 2109 0002', 2000000, 0, false));

    expect(balances()).toEqual(['RD$ 2,000,000.00']);
  });
});
