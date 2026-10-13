import { Product, ProductType } from './product.model';

export type ProductGroupStatus = 'loading' | 'loaded' | 'error';

export interface ProductGroup {
  readonly type: ProductType;
  readonly status: ProductGroupStatus;
  readonly products: readonly Product[];
}
