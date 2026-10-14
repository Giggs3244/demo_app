import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: '',
  styleUrl: 'icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[style.--icon-image]': 'image()',
    '[style.--icon-size.px]': 'size()',
  },
})
export class IconComponent {
  readonly src = input.required<string>();
  readonly size = input(24);

  protected readonly image = computed(() => `url(${this.src()})`);
}
