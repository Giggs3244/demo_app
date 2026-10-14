import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IonContent } from '@ionic/angular';

import { HeaderComponent, HeaderLeading } from '../../shared/components/header/header.component';
import { PlaceholderContentComponent } from '../../shared/components/placeholder-content/placeholder-content.component';

export interface PlaceholderPageData {
  readonly title: string;
  readonly heading: string;
  readonly leading?: HeaderLeading;
}

const DEFAULT_LEADING: HeaderLeading = 'menu';
const DESCRIPTION =
  'Esta pantalla es únicamente para validar como se construye la navegación de la aplicación, por lo tanto, este puede ser el único contenido';

@Component({
  selector: 'app-placeholder',
  templateUrl: 'placeholder.page.html',
  styleUrl: 'placeholder.page.scss',
  imports: [IonContent, HeaderComponent, PlaceholderContentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceholderPage {
  readonly title = input.required<string>();
  readonly heading = input.required<string>();
  readonly leading = input(DEFAULT_LEADING, {
    transform: (leading: HeaderLeading | undefined) => leading ?? DEFAULT_LEADING,
  });

  protected readonly description = DESCRIPTION;
}
