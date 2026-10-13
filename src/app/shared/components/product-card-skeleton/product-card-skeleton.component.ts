import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonSkeletonText } from '@ionic/angular';

@Component({
  selector: 'app-product-card-skeleton',
  templateUrl: 'product-card-skeleton.component.html',
  styleUrl: 'product-card-skeleton.component.scss',
  imports: [IonSkeletonText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'status', 'aria-busy': 'true', 'aria-label': 'Cargando productos' },
})
export class ProductCardSkeletonComponent {}
