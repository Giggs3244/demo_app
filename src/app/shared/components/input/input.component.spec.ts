import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let fixture: ComponentFixture<InputComponent>;
  let component: InputComponent;
  let ionInput: HTMLIonInputElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('placeholder', 'Documento de identidad');
    await fixture.whenStable();
    ionInput = fixture.nativeElement.querySelector('ion-input');
  });

  it('should pass the placeholder and use it as accessible name', () => {
    expect(ionInput.placeholder).toBe('Documento de identidad');
    expect(ionInput.getAttribute('aria-label')).toBe('Documento de identidad');
  });

  it('should be a text input without icon by default', () => {
    expect(ionInput.type).toBe('text');
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
  });

  it('should render the icon and the configured type', async () => {
    fixture.componentRef.setInput('icon', 'assets/icons/key-input-gray.svg');
    fixture.componentRef.setInput('type', 'password');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('img').getAttribute('src')).toBe('assets/icons/key-input-gray.svg');
    expect(ionInput.type).toBe('password');
  });

  it('should show the model value', async () => {
    component.value.set('00100010321');
    await fixture.whenStable();

    expect(ionInput.value).toBe('00100010321');
  });

  it('should update the model when the user types', () => {
    ionInput.dispatchEvent(new CustomEvent('ionInput', { detail: { value: '1111' } }));

    expect(component.value()).toBe('1111');
  });

  it('should treat a cleared input as an empty string', () => {
    component.value.set('abc');

    ionInput.dispatchEvent(new CustomEvent('ionInput', { detail: { value: null } }));

    expect(component.value()).toBe('');
  });

  it('should report the touch when the input loses focus', () => {
    const onTouch = vi.fn();
    component.touch.subscribe(onTouch);

    ionInput.dispatchEvent(new CustomEvent('ionBlur'));

    expect(onTouch).toHaveBeenCalledOnce();
  });

  it('should forward the disabled state', async () => {
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();

    expect(ionInput.disabled).toBe(true);
    expect(fixture.nativeElement.querySelector('.field').classList).toContain('field--disabled');
  });
});
