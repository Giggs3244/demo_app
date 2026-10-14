import { Injectable, effect, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';

import { ProductGroup } from '../models/product-group.model';
import { Product, ProductType } from '../models/product.model';
import { ProductsService } from './products.service';
import { SessionStore } from './session.store';

@Injectable({ providedIn: 'root' })
export class ProductsStore {
  private readonly service = inject(ProductsService);
  private readonly session = inject(SessionStore);
  private readonly groupsState = signal<readonly ProductGroup[]>([]);
  private loading: Subscription | null = null;

  readonly groups = this.groupsState.asReadonly();

  constructor() {
    effect(() => {
      if (!this.session.isAuthenticated()) {
        this.clear();
      }
    });
  }

  load(): void {
    this.loading?.unsubscribe();
    this.loading = this.service.loadGroups().subscribe((groups) => this.groupsState.set(groups));
  }

  find(type: ProductType, lastDigits: string): Product | undefined {
    return this.groupsState()
      .find((group) => group.type === type)
      ?.products.find((product) => product.lastDigits === lastDigits);
  }

  private clear(): void {
    this.loading?.unsubscribe();
    this.loading = null;
    this.groupsState.set([]);
  }
}
