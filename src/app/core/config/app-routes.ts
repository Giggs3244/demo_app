import { Product } from '../models/product.model';

export const APP_ROUTES = {
  onboarding: '/onboarding',
  login: '/login',
  products: '/tabs/products',
  productDetail: '/product',
} as const;

export const productDetailLink = (product: Product): string[] => [
  APP_ROUTES.productDetail,
  product.type,
  product.lastDigits,
];
