import { ChangeDetectionStrategy, Component, booleanAttribute, input, model, output } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { InputCustomEvent, IonInput } from '@ionic/angular';

export type InputType = 'text' | 'password';
export type InputMode = 'text' | 'numeric';

@Component({
  selector: 'app-input',
  templateUrl: 'input.component.html',
  styleUrl: 'input.component.scss',
  imports: [IonInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent implements FormValueControl<string> {
  readonly value = model('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  readonly id = input<string>('app_input');
  readonly placeholder = input.required<string>();
  readonly type = input<InputType>('text');
  readonly inputMode = input<InputMode>('text');
  readonly autocomplete = input<'username' | 'current-password' | 'off'>('off');
  readonly icon = input<string>();

  protected onInput(event: InputCustomEvent): void {
    this.value.set(event.detail.value ?? '');
  }
}
