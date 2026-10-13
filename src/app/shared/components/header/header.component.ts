import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IonBackButton, IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular';

export type HeaderLeading = 'menu' | 'back' | 'none';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrl: 'header.component.scss',
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonBackButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly title = input.required<string>();
  readonly leading = input<HeaderLeading>('menu');
  readonly backHref = input('/');

  protected readonly backIcon = 'assets/icons/arrow-back-green.svg';
}
