import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavController, provideIonicAngular } from '@ionic/angular';
import { Subject } from 'rxjs';

import { APP_ROUTES } from '../../../core/config/app-routes';
import { AuthService } from '../../../core/services/auth.service';
import { StorageService } from '../../../core/services/storage.service';
import { UserPreferencesService } from '../../../core/services/user-preferences.service';
import { InMemoryStorageService } from '../../../core/testing/in-memory-storage.service';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>;
  let element: HTMLElement;
  let preferences: UserPreferencesService;
  let signInResult: Subject<void>;
  let toastElement: HTMLIonToastElement;
  const auth = { signIn: vi.fn() };
  const navigation = { navigateRoot: vi.fn() };

  const inputs = (): HTMLIonInputElement[] => [...element.querySelectorAll('ion-input')];
  const toggle = (): HTMLIonToggleElement => element.querySelector('ion-toggle') as HTMLIonToggleElement;
  const toast = (): HTMLIonToastElement => toastElement;
  const isLoading = (): boolean => element.querySelector('app-loading-overlay') !== null;

  const enter = async (): Promise<void> => {
    await fixture.componentInstance.ionViewWillEnter();
    await fixture.whenStable();
  };

  const fill = async (userId: string, password: string, rememberUser = false): Promise<void> => {
    inputs()[0].dispatchEvent(new CustomEvent('ionInput', { detail: { value: userId } }));
    inputs()[1].dispatchEvent(new CustomEvent('ionInput', { detail: { value: password } }));
    toggle().dispatchEvent(new CustomEvent('ionChange', { detail: { checked: rememberUser } }));
    await fixture.whenStable();
  };

  const submit = async (): Promise<void> => {
    element.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
  };

  const settle = async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    signInResult = new Subject<void>();
    auth.signIn.mockReset().mockReturnValue(signInResult);
    navigation.navigateRoot.mockReset().mockResolvedValue(true);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideIonicAngular({ mode: 'md' }),
        { provide: AuthService, useValue: auth },
        { provide: NavController, useValue: navigation },
        { provide: StorageService, useClass: InMemoryStorageService },
      ],
    });
    preferences = TestBed.inject(UserPreferencesService);
    fixture = TestBed.createComponent(LoginPage);
    element = fixture.nativeElement;
    await fixture.whenStable();
    toastElement = element.querySelector('ion-toast') as HTMLIonToastElement;
  });

  afterEach(() => toastElement.remove());

  describe('when the page enters', () => {
    it('should show an empty form when no user was remembered', async () => {
      await enter();

      expect(inputs().map((input) => input.value)).toEqual(['', '']);
      expect(toggle().checked).toBe(false);
    });

    it('should prefill the remembered user and turn the toggle on', async () => {
      await preferences.rememberUserId('00100010321');

      await enter();

      expect(inputs().map((input) => input.value)).toEqual(['00100010321', '']);
      expect(toggle().checked).toBe(true);
    });

    it('should clear the password typed in a previous visit', async () => {
      await enter();
      await fill('00100010321', '1111');

      await enter();

      expect(inputs()[1].value).toBe('');
    });
  });

  describe('when the form is incomplete', () => {
    it('should show the error without calling the API', async () => {
      await enter();
      await fill('00100010321', '');

      await submit();

      expect(auth.signIn).not.toHaveBeenCalled();
      expect(toast().isOpen).toBe(true);
      expect(toast().message).toBe('Usuario y/o contraseña incorrectos');
      expect(isLoading()).toBe(false);
    });
  });

  describe('when the form is submitted', () => {
    beforeEach(async () => {
      await enter();
    });

    it('should send the credentials and show the loading overlay while waiting', async () => {
      await fill('00100010321', '1111');

      await submit();

      expect(auth.signIn).toHaveBeenCalledWith({ userId: '00100010321', password: '1111' });
      expect(isLoading()).toBe(true);
    });

    it('should ignore a second submit while the first one is in progress', async () => {
      await fill('00100010321', '1111');

      await submit();
      await submit();

      expect(auth.signIn).toHaveBeenCalledOnce();
    });

    it('should go to the products page as the new root after signing in', async () => {
      await fill('00100010321', '1111');
      await submit();

      signInResult.next();
      signInResult.complete();
      await settle();

      expect(navigation.navigateRoot).toHaveBeenCalledWith(APP_ROUTES.products);
      expect(isLoading()).toBe(false);
      expect(toast().isOpen).toBe(false);
    });

    it('should remember the user when the toggle is on', async () => {
      await fill('00100010321', '1111', true);
      await submit();

      signInResult.next();
      signInResult.complete();
      await settle();

      expect(await preferences.getRememberedUserId()).toBe('00100010321');
    });

    it('should forget a remembered user when the toggle is off', async () => {
      await preferences.rememberUserId('00100010321');
      await fill('00100010321', '1111', false);
      await submit();

      signInResult.next();
      signInResult.complete();
      await settle();

      expect(await preferences.getRememberedUserId()).toBeNull();
    });

    it('should show the credentials error and stay on the page on a 401', async () => {
      await fill('00100010321', '0000', true);
      await submit();

      signInResult.error(new HttpErrorResponse({ status: 401 }));
      await settle();

      expect(toast().isOpen).toBe(true);
      expect(toast().message).toBe('Usuario y/o contraseña incorrectos');
      expect(navigation.navigateRoot).not.toHaveBeenCalled();
      expect(await preferences.getRememberedUserId()).toBeNull();
      expect(isLoading()).toBe(false);
    });

    it('should show a generic error for any other failure', async () => {
      await fill('00100010321', '1111');
      await submit();

      signInResult.error(new HttpErrorResponse({ status: 0 }));
      await settle();

      expect(toast().message).toBe('No fue posible iniciar sesión. Intenta de nuevo');
      expect(navigation.navigateRoot).not.toHaveBeenCalled();
    });

    it('should close the error when the toast is dismissed', async () => {
      await submit();
      expect(toast().isOpen).toBe(true);

      toast().dispatchEvent(new CustomEvent('didDismiss'));
      await fixture.whenStable();

      expect(toast().isOpen).toBe(false);
    });
  });
});
