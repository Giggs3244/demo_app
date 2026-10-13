import { Balance, Product, ProductType } from './product.model';

export class Account extends Product {
  readonly type: ProductType = 'AC';

  constructor(
    alias: string,
    number: string,
    readonly availableAmount: number,
  ) {
    super(alias, number);
  }

  get balances(): readonly Balance[] {
    return [{ currency: 'RD$', amount: this.availableAmount }];
  }
}
