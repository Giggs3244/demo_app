import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonMenu, IonMenuToggle, IonRouterLinkWithHref, NavController } from '@ionic/angular';

import { APP_ROUTES } from '../../core/config/app-routes';
import { AuthService } from '../../core/services/auth.service';
import { SessionStore } from '../../core/services/session.store';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { MAIN_SECTION_LINKS, SUPPORT_LINKS } from '../../shared/config/main-sections';

export const MAIN_CONTENT_ID = 'main-content';

@Component({
  selector: 'app-side-menu',
  templateUrl: 'side-menu.component.html',
  styleUrl: 'side-menu.component.scss',
  imports: [IonMenu, IonMenuToggle, IonRouterLinkWithHref, RouterLink, ButtonComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent {
  private readonly auth = inject(AuthService);
  private readonly session = inject(SessionStore);
  private readonly menu = viewChild.required(IonMenu);
  private readonly navigation = inject(NavController);

  protected readonly contentId = MAIN_CONTENT_ID;
  protected readonly mainLinks = MAIN_SECTION_LINKS;
  protected readonly supportLinks = SUPPORT_LINKS;
  protected readonly isAuthenticated = this.session.isAuthenticated;
  protected readonly user = this.session.user;

  protected async signOut(): Promise<void> {
    await this.menu().close();
    this.auth.signOut();
    await this.navigation.navigateRoot(APP_ROUTES.login, { animated: true, animationDirection: 'back' });
  }
}
