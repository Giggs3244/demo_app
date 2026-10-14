import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { IonRouterOutlet, provideIonicAngular } from '@ionic/angular';

import { AppComponent } from './app.component';
import { NativeAppService } from './core/services/native-app.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let element: HTMLElement;
  const nativeApp = { exit: vi.fn() };

  const pressHardwareBack = (): void => {
    document.dispatchEvent(new CustomEvent('ionBackButton', { detail: { register: registerHandler } }));
  };

  const handlers: { priority: number; handler: (next: () => void) => void }[] = [];
  const registerHandler = (priority: number, handler: (next: () => void) => void): void => {
    handlers.push({ priority, handler });
  };

  const runBackHandlers = (): void => {
    handlers.length = 0;
    pressHardwareBack();
    const queue = [...handlers].sort((first, second) => second.priority - first.priority);
    const runNext = (): void => queue.shift()?.handler(runNext);

    runNext();
  };

  beforeEach(async () => {
    nativeApp.exit.mockReset().mockResolvedValue(undefined);
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideIonicAngular({ mode: 'md' }),
        { provide: NativeAppService, useValue: nativeApp },
      ],
    });
    fixture = TestBed.createComponent(AppComponent);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => vi.restoreAllMocks());

  it('should render the side menu attached to the router outlet', () => {
    const menu = element.querySelector('ion-menu');
    const outlet = element.querySelector('ion-router-outlet');

    expect(menu).not.toBeNull();
    expect(outlet?.id).toBe(menu?.contentId);
  });

  it('should close the app when the hardware back button is pressed on a root page', () => {
    runBackHandlers();

    expect(nativeApp.exit).toHaveBeenCalledOnce();
  });

  it('should not close the app while there is a page to go back to', () => {
    const outlet: IonRouterOutlet = fixture.debugElement.query(By.directive(IonRouterOutlet)).componentInstance;
    vi.spyOn(outlet, 'canGoBack').mockReturnValue(true);

    runBackHandlers();

    expect(nativeApp.exit).not.toHaveBeenCalled();
  });

  it('should stop listening to the back button when destroyed', () => {
    fixture.destroy();

    runBackHandlers();

    expect(nativeApp.exit).not.toHaveBeenCalled();
  });
});
