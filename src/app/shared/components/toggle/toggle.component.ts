import { ChangeDetectionStrategy, Component, booleanAttribute, input, model, output } from '@angular/core';
import { FormCheckboxControl } from '@angular/forms/signals';
import { IonToggle, ToggleCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-toggle',
  templateUrl: 'toggle.component.html',
  styleUrl: 'toggle.component.scss',
  imports: [IonToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleComponent implements FormCheckboxControl {
  readonly checked = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly touch = output<void>();

  protected onChange(event: ToggleCustomEvent): void {
    this.checked.set(event.detail.checked);
  }
}
