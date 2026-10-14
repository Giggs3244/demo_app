import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideIonicAngular } from '@ionic/angular';
import { NEVER } from 'rxjs';

import { routes } from '../../app.routes';
import { ProductsService } from '../../core/services/products.service';
import { SessionStore } from '../../core/services/session.store';
import { UserService } from '../../core/services/user.service';
import { PlaceholderPage } from '../placeholder/placeholder.page';
import { TabsPage } from './tabs.page';

describe('Tabs navigation', () => {
  let harness: RouterTestingHarness;
  const userService = { loadUser: vi.fn() };

  beforeEach(async () => {
    userService.loadUser.mockReset().mockReturnValue(NEVER);
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideIonicAngular({ mode: 'md' }),
        { provide: ProductsService, useValue: { loadGroups: () => NEVER } },
        { provide: UserService, useValue: userService },
      ],
    });
    harness = await RouterTestingHarness.create();
  });

  it('should send a visitor without session to the login', async () => {
    await harness.navigateByUrl('/tabs/products');

    expect(TestBed.inject(SessionStore).isAuthenticated()).toBe(false);
    expect(harness.routeNativeElement?.tagName.toLowerCase()).toBe('app-login');
  });

  describe('with a session', () => {
    beforeEach(() => {
      TestBed.inject(SessionStore).start({ accessToken: 'access', refreshToken: 'refresh' });
    });

    it('should load the signed in user once for the side menu', async () => {
      await harness.navigateByUrl('/tabs/products', TabsPage);
      await harness.navigateByUrl('/tabs/offers', TabsPage);

      expect(userService.loadUser).toHaveBeenCalledOnce();
    });

    it('should open the products tab by default', async () => {
      await harness.navigateByUrl('/tabs', TabsPage);

      expect(harness.routeNativeElement?.querySelector('app-products')).not.toBeNull();
    });

    it('should show one tab button per section in the design order', async () => {
      await harness.navigateByUrl('/tabs/products', TabsPage);

      const buttons = [...(harness.routeNativeElement?.querySelectorAll('ion-tab-button') ?? [])];

      expect(buttons.map((button) => button.tab)).toEqual(['products', 'transactions', 'offers', 'configuration']);
      expect(buttons.map((button) => button.textContent?.trim())).toEqual([
        'Mis productos',
        'Transacciones',
        'Ofertas',
        'Configuración',
      ]);
    });

    it.each([
      ['transactions', 'Transacciones', 'Pantalla\nde transacciones'],
      ['offers', 'Ofertas', 'Pantalla\nde ofertas'],
      ['configuration', 'Configuración', 'Pantalla\nde configuración'],
    ])('should open the %s tab with its texts and the menu button', async (path, title, heading) => {
      await harness.navigateByUrl(`/tabs/${path}`, TabsPage);
      await harness.fixture.whenStable();

      const page = harness.routeNativeElement?.querySelector('app-placeholder');

      expect(page?.querySelector('ion-title')?.textContent?.trim()).toBe(title);
      expect(page?.querySelector('.placeholder__title')?.textContent).toBe(heading);
      expect(page?.querySelector('app-menu-button')).not.toBeNull();
    });
  });

  it.each([
    ['contact', 'Contacto', 'Pantalla\nde contacto'],
    ['branches', 'Sucursales', 'Pantalla\nde sucursales'],
  ])('should open /%s without session, with a back button', async (path, title, heading) => {
    await harness.navigateByUrl(`/${path}`, PlaceholderPage);
    await harness.fixture.whenStable();

    const page = harness.routeNativeElement;

    expect(userService.loadUser).not.toHaveBeenCalled();
    expect(page?.querySelector('ion-title')?.textContent?.trim()).toBe(title);
    expect(page?.querySelector('.placeholder__title')?.textContent).toBe(heading);
    expect(page?.querySelector('ion-back-button')).not.toBeNull();
    expect(page?.querySelector('app-menu-button')).toBeNull();
  });

  it('should fall back to the menu button when a placeholder route gives no leading', async () => {
    const fixture = TestBed.createComponent(PlaceholderPage);
    fixture.componentRef.setInput('title', 'Ofertas');
    fixture.componentRef.setInput('heading', 'Pantalla\nde ofertas');
    fixture.componentRef.setInput('leading', undefined);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-menu-button')).not.toBeNull();
  });
});
