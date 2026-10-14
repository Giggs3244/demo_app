import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';

import { MAIN_SECTIONS } from '../../shared/config/main-sections';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrl: 'tabs.page.scss',
  imports: [IonTabs, IonTabBar, IonTabButton, IonLabel],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsPage {
  protected readonly sections = MAIN_SECTIONS;
}
