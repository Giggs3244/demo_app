import { MOCK_ACCOUNTS, MOCK_CREDIT_CARDS } from '../mocks/mock-data';
import { Account } from '../models/account.model';
import { ProductDto } from '../models/api.dto';
import { CreditCard } from '../models/credit-card.model';
import { ProductFactory } from './product.factory';

describe('ProductFactory', () => {
  it('should create an Account from an AC dto', () => {
    const product = ProductFactory.create(MOCK_ACCOUNTS[0]);

    expect(product).toBeInstanceOf(Account);
    expect(product.alias).toBe('Cuenta de ahorros 1');
    expect(product.number).toBe('1234567890001');
    expect((product as Account).availableAmount).toBe(100000);
  });

  it('should create a CreditCard from a TC dto', () => {
    const product = ProductFactory.create(MOCK_CREDIT_CARDS[0]);

    expect(product).toBeInstanceOf(CreditCard);
    expect((product as CreditCard).availableAmountRD).toBe(1000000);
    expect((product as CreditCard).availableAmountUS).toBe(1000);
    expect((product as CreditCard).isInternational).toBe(true);
  });

  it('should reject an unknown product type', () => {
    const dto = { ...MOCK_ACCOUNTS[0], productType: 'XX' } as unknown as ProductDto;

    expect(() => ProductFactory.create(dto)).toThrowError('Unsupported product type: XX');
  });
});
