import { ChangeDetectionStrategy, Component, DestroyRef, inject, viewChild } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular';

import { NativeAppService } from './core/services/native-app.service';
import { MAIN_CONTENT_ID, SideMenuComponent } from './layout/side-menu/side-menu.component';

const EXIT_APP_PRIORITY = -1;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, SideMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly nativeApp = inject(NativeAppService);
  private readonly outlet = viewChild.required(IonRouterOutlet);

  protected readonly mainContentId = MAIN_CONTENT_ID;

  constructor() {
    const exitOnRootBack = inject(Platform).backButton.subscribeWithPriority(EXIT_APP_PRIORITY, () => {
      if (!this.outlet().canGoBack()) {
        void this.nativeApp.exit();
      }
    });

    inject(DestroyRef).onDestroy(() => exitOnRootBack.unsubscribe());
  }
}
