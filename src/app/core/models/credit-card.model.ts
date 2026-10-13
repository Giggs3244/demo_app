import { Balance, Product, ProductType } from './product.model';

export class CreditCard extends Product {
  readonly type: ProductType = 'TC';

  constructor(
    alias: string,
    number: string,
    readonly availableAmountRD: number,
    readonly availableAmountUS: number,
    readonly isInternational: boolean,
  ) {
    super(alias, number);
  }

  get balances(): readonly Balance[] {
    const local: Balance = { currency: 'RD$', amount: this.availableAmountRD };

    return this.isInternational ? [local, { currency: 'US$', amount: this.availableAmountUS }] : [local];
  }
}
