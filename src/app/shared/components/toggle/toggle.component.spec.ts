import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleComponent } from './toggle.component';

@Component({
  imports: [ToggleComponent],
  template: `<app-toggle [(checked)]="remember" (touch)="touched.set(true)">Recuerda mi usuario</app-toggle>`,
})
class HostComponent {
  readonly remember = signal(false);
  readonly touched = signal(false);
}

describe('ToggleComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let ionToggle: HTMLIonToggleElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    ionToggle = fixture.nativeElement.querySelector('ion-toggle');
  });

  it('should project the label after the switch', () => {
    expect(ionToggle.textContent?.trim()).toBe('Recuerda mi usuario');
    expect(ionToggle.labelPlacement).toBe('end');
  });

  it('should reflect the bound value', async () => {
    expect(ionToggle.checked).toBe(false);

    fixture.componentInstance.remember.set(true);
    await fixture.whenStable();

    expect(ionToggle.checked).toBe(true);
  });

  it('should update the bound value when the user switches it', () => {
    ionToggle.dispatchEvent(new CustomEvent('ionChange', { detail: { checked: true } }));

    expect(fixture.componentInstance.remember()).toBe(true);
  });

  it('should report the touch when it loses focus', () => {
    ionToggle.dispatchEvent(new CustomEvent('ionBlur'));

    expect(fixture.componentInstance.touched()).toBe(true);
  });
});
