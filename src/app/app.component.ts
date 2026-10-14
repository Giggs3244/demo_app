import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';

import { MAIN_CONTENT_ID, SideMenuComponent } from './layout/side-menu/side-menu.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, SideMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly mainContentId = MAIN_CONTENT_ID;
}
