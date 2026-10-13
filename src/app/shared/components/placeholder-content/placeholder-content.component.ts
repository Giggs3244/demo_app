import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-placeholder-content',
  templateUrl: 'placeholder-content.component.html',
  styleUrl: 'placeholder-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceholderContentComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
