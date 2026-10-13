import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonContent } from '@ionic/angular';

interface ColorSwatch {
  readonly name: string;
  readonly value: string;
}

interface TypeSample {
  readonly scale: string;
  readonly spec: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  protected readonly colors: readonly ColorSwatch[] = [
    { name: 'primary', value: '#49B742' },
    { name: 'secondary', value: '#00477A' },
    { name: 'danger', value: '#C92340' },
    { name: 'text', value: '#666666' },
    { name: 'text-muted', value: '#999999' },
    { name: 'placeholder', value: '#CCCCCC' },
    { name: 'border', value: 'rgba(204, 204, 204, 0.6)' },
    { name: 'background', value: '#F5F5F5' },
    { name: 'surface', value: '#FFFFFF' },
    { name: 'overlay', value: 'rgba(0, 0, 0, 0.16)' },
    { name: 'backdrop', value: 'rgba(0, 0, 0, 0.4)' },
    { name: 'toggle-off', value: 'rgba(255, 255, 255, 0.6)' },
  ];

  protected readonly typeScale: readonly TypeSample[] = [
    { scale: 'xs', spec: '10 / 11' },
    { scale: 'sm', spec: '12 / 14' },
    { scale: 'md', spec: '14 / 16' },
    { scale: 'lg', spec: '16 / 19' },
    { scale: 'xl', spec: '24 / 28' },
  ];
}
