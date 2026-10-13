import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, merge, of, scan, startWith } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints';
import { ProductFactory } from '../mappers/product.factory';
import { ProductDto } from '../models/api.dto';
import { ProductGroup } from '../models/product-group.model';
import { Product, ProductType } from '../models/product.model';

interface ProductSource {
  readonly type: ProductType;
  readonly endpoint: string;
}

const PRODUCT_SOURCES: readonly ProductSource[] = [
  { type: 'AC', endpoint: API_ENDPOINTS.accounts },
  { type: 'TC', endpoint: API_ENDPOINTS.creditCards },
];

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);

  getProducts(type: ProductType): Observable<Product[]> {
    const source = PRODUCT_SOURCES.find((candidate) => candidate.type === type);

    if (!source) {
      throw new Error(`No product source registered for type: ${type}`);
    }

    return this.http
      .get<ProductDto[]>(source.endpoint)
      .pipe(map((dtos) => dtos.map((dto) => ProductFactory.create(dto))));
  }

  loadGroups(): Observable<readonly ProductGroup[]> {
    const initial: readonly ProductGroup[] = PRODUCT_SOURCES.map(({ type }) => ({
      type,
      status: 'loading',
      products: [],
    }));

    const updates = PRODUCT_SOURCES.map(({ type }) =>
      this.getProducts(type).pipe(
        map((products): ProductGroup => ({ type, status: 'loaded', products })),
        catchError(() => of<ProductGroup>({ type, status: 'error', products: [] })),
      ),
    );

    return merge(...updates).pipe(
      scan((groups, update) => groups.map((group) => (group.type === update.type ? update : group)), initial),
      startWith(initial),
    );
  }
}
