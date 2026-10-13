import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';
import { IonButton } from '@ionic/angular';

export type ButtonVariant = 'solid' | 'outline';
export type ButtonType = 'button' | 'submit';

@Component({
  selector: 'app-button',
  templateUrl: 'button.component.html',
  styleUrl: 'button.component.scss',
  imports: [IonButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('solid');
  readonly type = input<ButtonType>('button');
  readonly disabled = input(false, { transform: booleanAttribute });
}
