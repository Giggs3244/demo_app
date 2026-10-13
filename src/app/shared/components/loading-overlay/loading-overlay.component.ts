import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loading-overlay',
  templateUrl: 'loading-overlay.component.html',
  styleUrl: 'loading-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'alert', 'aria-busy': 'true', 'aria-live': 'assertive' },
})
export class LoadingOverlayComponent {}
