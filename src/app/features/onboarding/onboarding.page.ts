import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { IonContent, MenuController, NavController, ViewWillEnter, ViewWillLeave } from '@ionic/angular';

import { APP_ROUTES } from '../../core/config/app-routes';
import { UserPreferencesService } from '../../core/services/user-preferences.service';

interface OnboardingSlide {
  readonly title: string;
  readonly image: string;
  readonly imageWidth: number;
  readonly imageHeight: number;
  readonly imageTop: number;
}

const SLIDES: readonly OnboardingSlide[] = [
  {
    title: 'Puedes ver tus\nproductos',
    image: 'assets/illustrations/demo-1-money.svg',
    imageWidth: 155.138,
    imageHeight: 144.439,
    imageTop: 363.8,
  },
  {
    title: 'Ahorra tiempo realizando\ntransacciones de forma\nrápida y segura',
    image: 'assets/illustrations/demo-2-stopwatch.svg',
    imageWidth: 139.685,
    imageHeight: 162.034,
    imageTop: 353.9,
  },
  {
    title: 'Aprovecha las ofertas\nque tenemos para ti',
    image: 'assets/illustrations/demo-3-tag.svg',
    imageWidth: 144,
    imageHeight: 151.714,
    imageTop: 364.1,
  },
];

@Component({
  selector: 'app-onboarding',
  templateUrl: 'onboarding.page.html',
  styleUrl: 'onboarding.page.scss',
  imports: [IonContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingPage implements ViewWillEnter, ViewWillLeave {
  private readonly preferences = inject(UserPreferencesService);
  private readonly navigation = inject(NavController);
  private readonly menu = inject(MenuController);
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  protected readonly slides = SLIDES;
  protected readonly activeIndex = signal(0);
  protected readonly isLastSlide = computed(() => this.activeIndex() === this.slides.length - 1);

  ionViewWillEnter(): void {
    void this.menu.enable(false);
  }

  ionViewWillLeave(): void {
    void this.menu.enable(true);
  }

  protected syncActiveSlide(): void {
    const { scrollLeft, clientWidth } = this.track().nativeElement;

    if (clientWidth > 0) {
      this.activeIndex.set(Math.round(scrollLeft / clientWidth));
    }
  }

  protected async continue(): Promise<void> {
    if (this.isLastSlide()) {
      await this.finish();
      return;
    }

    const track = this.track().nativeElement;
    track.scrollTo({ left: (this.activeIndex() + 1) * track.clientWidth, behavior: 'smooth' });
  }

  private async finish(): Promise<void> {
    await this.preferences.markOnboardingAsSeen();
    await this.navigation.navigateRoot(APP_ROUTES.login, { animated: true, animationDirection: 'forward' });
  }
}
