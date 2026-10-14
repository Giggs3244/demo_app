import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { IonMenu, NavController, provideIonicAngular } from '@ionic/angular';

import { APP_ROUTES } from '../../core/config/app-routes';
import { User } from '../../core/models/user.model';
import { SessionStore } from '../../core/services/session.store';
import { SideMenuComponent } from './side-menu.component';

describe('SideMenuComponent', () => {
  let fixture: ComponentFixture<SideMenuComponent>;
  let element: HTMLElement;
  let session: SessionStore;
  const calls: string[] = [];
  const navigation = { navigateRoot: vi.fn() };

  const links = (): { label: string; href: string | null; direction: string | null }[] =>
    [...element.querySelectorAll<HTMLAnchorElement>('.menu__link')].map((link) => ({
      label: link.textContent?.trim() ?? '',
      href: link.getAttribute('href'),
      direction: link.getAttribute('routerDirection'),
    }));

  const signIn = async (user?: User): Promise<void> => {
    session.start({ accessToken: 'access', refreshToken: 'refresh' });
    if (user) {
      session.setUser(user);
    }
    await fixture.whenStable();
  };

  beforeEach(async () => {
    calls.length = 0;
    navigation.navigateRoot.mockReset().mockImplementation(async (url: string) => {
      calls.push(`navigate:${url}:${session.isAuthenticated()}`);
      return true;
    });

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideIonicAngular({ mode: 'md' }),
        { provide: NavController, useValue: navigation },
      ],
    });
    session = TestBed.inject(SessionStore);
    fixture = TestBed.createComponent(SideMenuComponent);
    element = fixture.nativeElement;
    await fixture.whenStable();

    const ionMenu: IonMenu = fixture.debugElement.query(By.directive(IonMenu)).componentInstance;
    vi.spyOn(ionMenu, 'close').mockImplementation(async () => {
      calls.push(`close:${session.isAuthenticated()}`);
      return true;
    });
  });

  it('should be an overlay menu attached to the main content', () => {
    const ionMenu = element.querySelector('ion-menu');

    expect(ionMenu?.type).toBe('overlay');
    expect(ionMenu?.contentId).toBe('main-content');
  });

  describe('without a session', () => {
    it('should show the logo instead of the user', () => {
      expect(element.querySelector('.menu__logo')).not.toBeNull();
      expect(element.querySelector('.menu__avatar')).toBeNull();
    });

    it('should offer only contact and branches', () => {
      expect(links()).toEqual([
        { label: 'Contacto', href: '/contact', direction: 'forward' },
        { label: 'Sucursales', href: '/branches', direction: 'forward' },
      ]);
    });

    it('should not offer to sign out', () => {
      expect(element.querySelector('.menu__sign-out')).toBeNull();
    });
  });

  describe('with a session', () => {
    it('should show an empty avatar until the user is loaded', async () => {
      await signIn();

      expect(element.querySelector('.menu__logo')).toBeNull();
      expect(element.querySelector('.menu__avatar')).not.toBeNull();
      expect(element.querySelector('.menu__avatar img')).toBeNull();
      expect(element.querySelector('.menu__user')?.textContent).toBe('');
    });

    it('should show the user photo and full name', async () => {
      await signIn(new User('José', 'Pérez', 'https://example.com/photo.jpg'));

      expect(element.querySelector('.menu__avatar img')?.getAttribute('src')).toBe('https://example.com/photo.jpg');
      expect(element.querySelector('.menu__user')?.textContent).toBe('José Pérez');
    });

    it('should offer the four sections, a divider and then contact and branches', async () => {
      await signIn();

      expect(links()).toEqual([
        { label: 'Mis productos', href: '/tabs/products', direction: 'root' },
        { label: 'Transacciones', href: '/tabs/transactions', direction: 'root' },
        { label: 'Ofertas', href: '/tabs/offers', direction: 'root' },
        { label: 'Configuración', href: '/tabs/configuration', direction: 'root' },
        { label: 'Contacto', href: '/contact', direction: 'forward' },
        { label: 'Sucursales', href: '/branches', direction: 'forward' },
      ]);
      expect(element.querySelector('.menu__divider')).not.toBeNull();
    });

    it('should close the menu when a link is chosen', async () => {
      await signIn();

      const toggles = element.querySelectorAll('ion-menu-toggle');

      expect(toggles).toHaveLength(6);
      expect([...toggles].every((toggle) => toggle.querySelector('.menu__link') !== null)).toBe(true);
    });

    it('should close the menu, end the session and go to the login when signing out', async () => {
      await signIn(new User('José', 'Pérez', 'photo.jpg'));

      element.querySelector<HTMLElement>('.menu__sign-out')?.click();
      await fixture.whenStable();

      expect(calls).toEqual(['close:true', `navigate:${APP_ROUTES.login}:false`]);
      expect(session.user()).toBeNull();
      expect(element.querySelector('.menu__logo')).not.toBeNull();
    });
  });
});
