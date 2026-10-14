import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('should render the side menu attached to the router outlet', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideIonicAngular({ mode: 'md' })] });
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;

    const menu = element.querySelector('ion-menu');
    const outlet = element.querySelector('ion-router-outlet');

    expect(menu).not.toBeNull();
    expect(outlet?.id).toBe(menu?.contentId);
  });
});
