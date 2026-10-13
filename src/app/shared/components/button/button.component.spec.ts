import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent, ButtonVariant } from './button.component';

@Component({
  imports: [ButtonComponent],
  template: `<app-button [variant]="variant()" [disabled]="disabled()" type="submit">INICIAR SESIÓN</app-button>`,
})
class HostComponent {
  readonly variant = signal<ButtonVariant>('solid');
  readonly disabled = signal(false);
}

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let ionButton: HTMLIonButtonElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    ionButton = fixture.nativeElement.querySelector('ion-button');
  });

  it('should project the label', () => {
    expect(ionButton.textContent?.trim()).toBe('INICIAR SESIÓN');
  });

  it('should be a solid block button by default', () => {
    expect(ionButton.fill).toBe('solid');
    expect(ionButton.expand).toBe('block');
    expect(ionButton.type).toBe('submit');
    expect(ionButton.disabled).toBe(false);
  });

  it('should switch to the outline variant', async () => {
    fixture.componentInstance.variant.set('outline');
    await fixture.whenStable();

    expect(ionButton.fill).toBe('outline');
  });

  it('should forward the disabled state', async () => {
    fixture.componentInstance.disabled.set(true);
    await fixture.whenStable();

    expect(ionButton.disabled).toBe(true);
  });
});
