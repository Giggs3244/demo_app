import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IonContent } from '@ionic/angular';

import { ProductGroup } from '../../core/models/product-group.model';
import { ProductsService } from '../../core/services/products.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ProductCardSkeletonComponent } from '../../shared/components/product-card-skeleton/product-card-skeleton.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { PRODUCT_PRESENTATION } from '../../shared/config/product-presentation';

@Component({
  selector: 'app-products',
  templateUrl: 'products.page.html',
  styleUrl: 'products.page.scss',
  imports: [IonContent, HeaderComponent, ProductCardComponent, ProductCardSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPage {
  protected readonly presentation = PRODUCT_PRESENTATION;

  protected readonly groups = toSignal(inject(ProductsService).loadGroups(), {
    initialValue: [] as readonly ProductGroup[],
  });

  protected readonly firstLoadingType = computed(
    () => this.groups().find((group) => group.status === 'loading')?.type ?? null,
  );
}
