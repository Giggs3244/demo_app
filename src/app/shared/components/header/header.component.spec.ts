import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideIonicAngular({ mode: 'md' })] });
    fixture = TestBed.createComponent(HeaderComponent);
    element = fixture.nativeElement;
    fixture.componentRef.setInput('title', 'Mis productos');
    await fixture.whenStable();
  });

  it('should show the title', () => {
    expect(element.querySelector('ion-title')?.textContent?.trim()).toBe('Mis productos');
  });

  it('should show the menu button by default', () => {
    const menuButton = element.querySelector('ion-menu-button');

    expect(menuButton).not.toBeNull();
    expect(menuButton?.autoHide).toBe(false);
    expect(element.querySelector('ion-back-button')).toBeNull();
  });

  it('should show the back button pointing to the fallback route', async () => {
    fixture.componentRef.setInput('leading', 'back');
    fixture.componentRef.setInput('backHref', '/tabs/products');
    await fixture.whenStable();

    const backButton = element.querySelector('ion-back-button');

    expect(backButton?.defaultHref).toBe('/tabs/products');
    expect(backButton?.icon).toBe('assets/icons/arrow-back-green.svg');
    expect(element.querySelector('ion-menu-button')).toBeNull();
  });

  it('should show no leading button when asked', async () => {
    fixture.componentRef.setInput('leading', 'none');
    await fixture.whenStable();

    expect(element.querySelector('ion-buttons')).toBeNull();
  });
});
