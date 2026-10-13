import { formatNumber } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { CurrencySymbol, Product } from '../../../core/models/product.model';
import { PRODUCT_PRESENTATION } from '../../config/product-presentation';

const AMOUNT_LOCALE = 'en-US';
const AMOUNT_FORMAT = '1.2-2';
const DECIMAL_SEPARATOR = '.';

interface BalanceView {
  readonly currency: CurrencySymbol;
  readonly whole: string;
  readonly decimals: string;
}

@Component({
  selector: 'app-product-card',
  templateUrl: 'product-card.component.html',
  styleUrl: 'product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  readonly product = input.required<Product>();

  protected readonly presentation = computed(() => PRODUCT_PRESENTATION[this.product().type]);

  protected readonly balances = computed<readonly BalanceView[]>(() =>
    this.product().balances.map(({ currency, amount }) => {
      const [whole, decimals] = formatNumber(amount, AMOUNT_LOCALE, AMOUNT_FORMAT).split(DECIMAL_SEPARATOR);

      return { currency, whole, decimals: `${DECIMAL_SEPARATOR}${decimals}` };
    }),
  );
}
