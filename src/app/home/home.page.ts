import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { IonContent } from '@ionic/angular';

import { ProductFactory } from '../core/mappers/product.factory';
import { MOCK_ACCOUNTS, MOCK_CREDIT_CARDS } from '../core/mocks/mock-data';
import { Product } from '../core/models/product.model';
import { ButtonComponent } from '../shared/components/button/button.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { InputComponent } from '../shared/components/input/input.component';
import { LoadingOverlayComponent } from '../shared/components/loading-overlay/loading-overlay.component';
import { PlaceholderContentComponent } from '../shared/components/placeholder-content/placeholder-content.component';
import { ProductCardSkeletonComponent } from '../shared/components/product-card-skeleton/product-card-skeleton.component';
import { ProductCardComponent } from '../shared/components/product-card/product-card.component';
import { ToggleComponent } from '../shared/components/toggle/toggle.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonContent,
    FormField,
    ButtonComponent,
    HeaderComponent,
    InputComponent,
    LoadingOverlayComponent,
    PlaceholderContentComponent,
    ProductCardComponent,
    ProductCardSkeletonComponent,
    ToggleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  protected readonly model = signal({ userId: '', password: '', rememberUser: false });
  protected readonly demoForm = form(this.model);
  protected readonly loading = signal(false);

  protected readonly products: readonly Product[] = [...MOCK_ACCOUNTS, ...MOCK_CREDIT_CARDS].map((dto) =>
    ProductFactory.create(dto),
  );

  protected showLoading(): void {
    this.loading.set(true);
    setTimeout(() => this.loading.set(false), 2000);
  }
}
