import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { EMPTY, catchError } from 'rxjs';

import { UserService } from '../../core/services/user.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { MAIN_SECTIONS } from '../../shared/config/main-sections';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrl: 'tabs.page.scss',
  imports: [IonTabs, IonTabBar, IonTabButton, IonLabel, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsPage {
  protected readonly sections = MAIN_SECTIONS;
  protected readonly iconSize = 30;

  constructor() {
    inject(UserService)
      .loadUser()
      .pipe(
        catchError(() => EMPTY),
        takeUntilDestroyed(),
      )
      .subscribe();
  }
}
