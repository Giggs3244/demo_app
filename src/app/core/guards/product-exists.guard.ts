import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { APP_ROUTES } from '../config/app-routes';
import { ProductsStore } from '../services/products.store';

export const productExistsGuard: CanActivateFn = (route) => {
  const { type, digits } = route.params;

  return inject(ProductsStore).find(type, digits) !== undefined || inject(Router).parseUrl(APP_ROUTES.products);
};
