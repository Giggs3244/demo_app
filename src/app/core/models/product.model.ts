export type ProductType = 'AC' | 'TC';

export type CurrencySymbol = 'RD$' | 'US$';

export interface Balance {
  readonly currency: CurrencySymbol;
  readonly amount: number;
}

const VISIBLE_DIGITS = 4;

export abstract class Product {
  abstract readonly type: ProductType;

  protected constructor(
    readonly alias: string,
    readonly number: string,
  ) {}

  abstract get balances(): readonly Balance[];

  get lastDigits(): string {
    return this.number.replace(/\D/g, '').slice(-VISIBLE_DIGITS);
  }

  get displayName(): string {
    return `${this.alias} - ${this.lastDigits}`;
  }
}
