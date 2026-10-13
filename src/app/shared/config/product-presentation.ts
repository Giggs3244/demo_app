import { ProductType } from '../../core/models/product.model';

export type ProductAccent = 'primary' | 'secondary';

export interface ProductPresentation {
  readonly groupTitle: string;
  readonly icon: string;
  readonly accent: ProductAccent;
}

export const PRODUCT_PRESENTATION: Readonly<Record<ProductType, ProductPresentation>> = {
  AC: { groupTitle: 'CUENTAS', icon: 'assets/icons/save-money-40-gray.svg', accent: 'primary' },
  TC: { groupTitle: 'TARJETAS', icon: 'assets/icons/card-40-gray.svg', accent: 'secondary' },
};
