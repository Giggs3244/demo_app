import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

import { MenuButtonComponent } from '../menu-button/menu-button.component';

export type HeaderLeading = 'menu' | 'back' | 'none';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrl: 'header.component.scss',
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, MenuButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly title = input.required<string>();
  readonly leading = input<HeaderLeading>('menu');
  readonly backHref = input('/');

  protected readonly backIcon = 'assets/icons/arrow-back-green.svg';
}
