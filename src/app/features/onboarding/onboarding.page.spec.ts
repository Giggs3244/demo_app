import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { MenuController, NavController, provideIonicAngular } from '@ionic/angular';
import { NEVER } from 'rxjs';

import { routes } from '../../app.routes';
import { APP_ROUTES } from '../../core/config/app-routes';
import { ProductsService } from '../../core/services/products.service';
import { SessionStore } from '../../core/services/session.store';
import { StorageService } from '../../core/services/storage.service';
import { UserPreferencesService } from '../../core/services/user-preferences.service';
import { UserService } from '../../core/services/user.service';
import { InMemoryStorageService } from '../../core/testing/in-memory-storage.service';
import { OnboardingPage } from './onboarding.page';

const SLIDE_WIDTH = 375;

describe('OnboardingPage', () => {
  let fixture: ComponentFixture<OnboardingPage>;
  let element: HTMLElement;
  let track: HTMLElement;
  let preferences: UserPreferencesService;
  const navigation = { navigateRoot: vi.fn() };
  const menu = { enable: vi.fn() };

  const activeDot = (): number =>
    [...element.querySelectorAll('.onboarding__dot')].findIndex((dot) =>
      dot.classList.contains('onboarding__dot--active'),
    );

  const visibleSlides = (): number[] =>
    [...element.querySelectorAll('.slide')]
      .map((slide, index) => (slide.getAttribute('aria-hidden') === 'false' ? index : -1))
      .filter((index) => index >= 0);

  const continueButton = (): HTMLButtonElement => element.querySelector('.onboarding__continue') as HTMLButtonElement;

  const tap = async (target: HTMLElement): Promise<void> => {
    target.click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    navigation.navigateRoot.mockReset().mockResolvedValue(true);
    menu.enable.mockReset().mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideIonicAngular({ mode: 'md' }),
        { provide: NavController, useValue: navigation },
        { provide: MenuController, useValue: menu },
        { provide: StorageService, useClass: InMemoryStorageService },
      ],
    });
    preferences = TestBed.inject(UserPreferencesService);
    fixture = TestBed.createComponent(OnboardingPage);
    element = fixture.nativeElement;
    await fixture.whenStable();

    track = element.querySelector('.onboarding__track') as HTMLElement;
    Object.defineProperty(track, 'clientWidth', { value: SLIDE_WIDTH });
    track.scrollTo = ((options: ScrollToOptions) => {
      track.scrollLeft = options.left ?? 0;
      track.dispatchEvent(new Event('scroll'));
    }) as typeof track.scrollTo;
  });

  it('should show the three slides of the design with the first one active', () => {
    const titles = [...element.querySelectorAll('.slide__title')].map((title) => title.textContent);

    expect(titles).toEqual([
      'Puedes ver tus\nproductos',
      'Ahorra tiempo realizando\ntransacciones de forma\nrápida y segura',
      'Aprovecha las ofertas\nque tenemos para ti',
    ]);
    expect(element.querySelectorAll('.onboarding__dot')).toHaveLength(3);
    expect(activeDot()).toBe(0);
    expect(visibleSlides()).toEqual([0]);
  });

  it('should move to the next slide with the continue button', async () => {
    await tap(continueButton());

    expect(track.scrollLeft).toBe(SLIDE_WIDTH);
    expect(activeDot()).toBe(1);
    expect(visibleSlides()).toEqual([1]);
    expect(navigation.navigateRoot).not.toHaveBeenCalled();
  });

  it('should move to the next slide when the slide itself is tapped', async () => {
    await tap(track);

    expect(activeDot()).toBe(1);
  });

  it('should follow the slide the user swipes to', async () => {
    track.scrollLeft = SLIDE_WIDTH * 2;
    track.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();

    expect(activeDot()).toBe(2);
  });

  it('should remember the onboarding and open the login after the last slide', async () => {
    await tap(continueButton());
    await tap(continueButton());
    expect(await preferences.hasSeenOnboarding()).toBe(false);

    await tap(continueButton());

    expect(await preferences.hasSeenOnboarding()).toBe(true);
    expect(navigation.navigateRoot).toHaveBeenCalledWith(APP_ROUTES.login, {
      animated: true,
      animationDirection: 'forward',
    });
  });

  it('should disable the side menu while it is visible and restore it on leave', () => {
    fixture.componentInstance.ionViewWillEnter();
    expect(menu.enable).toHaveBeenLastCalledWith(false);

    fixture.componentInstance.ionViewWillLeave();
    expect(menu.enable).toHaveBeenLastCalledWith(true);
  });
});

describe('First launch routing', () => {
  let harness: RouterTestingHarness;
  let preferences: UserPreferencesService;

  const currentPage = (): string => harness.routeNativeElement?.tagName.toLowerCase() ?? '';

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideIonicAngular({ mode: 'md' }),
        { provide: MenuController, useValue: { enable: vi.fn().mockResolvedValue(undefined) } },
        { provide: ProductsService, useValue: { loadGroups: () => NEVER } },
        { provide: UserService, useValue: { loadUser: () => NEVER } },
        { provide: StorageService, useClass: InMemoryStorageService },
      ],
    });
    preferences = TestBed.inject(UserPreferencesService);
    harness = await RouterTestingHarness.create();
  });

  it('should open the onboarding on the first launch', async () => {
    await harness.navigateByUrl('/');

    expect(currentPage()).toBe('app-onboarding');
  });

  it('should open the login once the onboarding was seen', async () => {
    await preferences.markOnboardingAsSeen();

    await harness.navigateByUrl('/');

    expect(currentPage()).toBe('app-login');
  });

  it('should keep a signed in user away from the onboarding', async () => {
    TestBed.inject(SessionStore).start({ accessToken: 'access', refreshToken: 'refresh' });

    await harness.navigateByUrl('/onboarding');

    expect(currentPage()).toBe('app-tabs');
  });
});
