import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonMenuButton } from '@ionic/angular';

@Component({
  selector: 'app-menu-button',
  templateUrl: 'menu-button.component.html',
  styleUrl: 'menu-button.component.scss',
  imports: [IonMenuButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuButtonComponent {}
