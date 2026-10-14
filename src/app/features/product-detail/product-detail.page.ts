import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { IonContent } from '@ionic/angular';

import { APP_ROUTES } from '../../core/config/app-routes';
import { ProductType } from '../../core/models/product.model';
import { ProductsStore } from '../../core/services/products.store';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { PlaceholderContentComponent } from '../../shared/components/placeholder-content/placeholder-content.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-detail',
  templateUrl: 'product-detail.page.html',
  styleUrl: 'product-detail.page.scss',
  imports: [IonContent, HeaderComponent, PlaceholderContentComponent, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailPage {
  private readonly store = inject(ProductsStore);

  readonly type = input.required<ProductType>();
  readonly digits = input.required<string>();

  protected readonly product = computed(() => this.store.find(this.type(), this.digits()));
  protected readonly backHref = APP_ROUTES.products;
  protected readonly heading = 'Pantalla\nde detalle de producto';
  protected readonly description =
    'Esta pantalla es únicamente para validar como se construye la navegación de la aplicación, y el paso de datos entre pantallas; por lo tanto, este puede ser el único contenido';
}
