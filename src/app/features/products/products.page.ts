import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonRouterLinkWithHref } from '@ionic/angular';

import { productDetailLink } from '../../core/config/app-routes';
import { ProductsStore } from '../../core/services/products.store';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ProductCardSkeletonComponent } from '../../shared/components/product-card-skeleton/product-card-skeleton.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { PRODUCT_PRESENTATION } from '../../shared/config/product-presentation';

@Component({
  selector: 'app-products',
  templateUrl: 'products.page.html',
  styleUrl: 'products.page.scss',
  imports: [
    IonContent,
    IonRouterLinkWithHref,
    RouterLink,
    HeaderComponent,
    ProductCardComponent,
    ProductCardSkeletonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPage {
  private readonly store = inject(ProductsStore);

  protected readonly presentation = PRODUCT_PRESENTATION;
  protected readonly detailLink = productDetailLink;
  protected readonly groups = this.store.groups;

  protected readonly firstLoadingType = computed(
    () => this.groups().find((group) => group.status === 'loading')?.type ?? null,
  );

  constructor() {
    this.store.load();
  }
}
