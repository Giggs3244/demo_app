import { Account } from './account.model';
import { CreditCard } from './credit-card.model';
import { Product } from './product.model';
import { User } from './user.model';

describe('Product models', () => {
  describe('Account', () => {
    const account = new Account('Cuenta de ahorros 1', '1234567890001', 100000);

    it('should be a product of type AC', () => {
      expect(account).toBeInstanceOf(Product);
      expect(account.type).toBe('AC');
    });

    it('should expose the last four digits of its number', () => {
      expect(account.lastDigits).toBe('0001');
    });

    it('should build the display name from alias and last digits', () => {
      expect(account.displayName).toBe('Cuenta de ahorros 1 - 0001');
    });

    it('should expose a single balance in local currency', () => {
      expect(account.balances).toEqual([{ currency: 'RD$', amount: 100000 }]);
    });
  });

  describe('CreditCard', () => {
    it('should be a product of type TC', () => {
      const card = new CreditCard('Tarjeta', '0987 6543 2109 0001', 1000, 10, true);

      expect(card).toBeInstanceOf(Product);
      expect(card.type).toBe('TC');
    });

    it('should ignore spaces when reading the last digits', () => {
      const card = new CreditCard('Tarjeta de crédito 1', '0987 6543 2109 0001', 1000, 10, true);

      expect(card.lastDigits).toBe('0001');
      expect(card.displayName).toBe('Tarjeta de crédito 1 - 0001');
    });

    it('should expose both balances when it is international', () => {
      const card = new CreditCard('Tarjeta', '0987 6543 2109 0001', 1000000, 1000, true);

      expect(card.balances).toEqual([
        { currency: 'RD$', amount: 1000000 },
        { currency: 'US$', amount: 1000 },
      ]);
    });

    it('should expose only the local balance when it is not international', () => {
      const card = new CreditCard('Tarjeta', '0987 6543 2109 0002', 2000000, 0, false);

      expect(card.balances).toEqual([{ currency: 'RD$', amount: 2000000 }]);
    });
  });

  describe('User', () => {
    it('should build the full name', () => {
      expect(new User('José', 'Pérez', 'photo.jpg').fullName).toBe('José Pérez');
    });
  });
});
