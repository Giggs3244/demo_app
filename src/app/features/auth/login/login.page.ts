import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { IonContent, IonToast, NavController, ViewWillEnter } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

import { APP_ROUTES } from '../../../core/config/app-routes';
import { AuthService } from '../../../core/services/auth.service';
import { UserPreferencesService } from '../../../core/services/user-preferences.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay.component';
import { MenuButtonComponent } from '../../../shared/components/menu-button/menu-button.component';
import { ToggleComponent } from '../../../shared/components/toggle/toggle.component';

interface LoginFormModel {
  userId: string;
  password: string;
  rememberUser: boolean;
}

const INVALID_CREDENTIALS_MESSAGE = 'Usuario y/o contraseña incorrectos';
const UNEXPECTED_ERROR_MESSAGE = 'No fue posible iniciar sesión. Intenta de nuevo';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrl: 'login.page.scss',
  imports: [
    IonContent,
    IonToast,
    FormField,
    ButtonComponent,
    InputComponent,
    LoadingOverlayComponent,
    MenuButtonComponent,
    ToggleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage implements ViewWillEnter {
  private readonly auth = inject(AuthService);
  private readonly preferences = inject(UserPreferencesService);
  private readonly navigation = inject(NavController);

  protected readonly model = signal<LoginFormModel>({ userId: '', password: '', rememberUser: false });
  protected readonly loginForm = form(this.model, (path) => {
    required(path.userId);
    required(path.password);
  });
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly errorDurationMs = 3000;

  async ionViewWillEnter(): Promise<void> {
    const rememberedUserId = await this.preferences.getRememberedUserId();

    this.model.set({
      userId: rememberedUserId ?? '',
      password: '',
      rememberUser: rememberedUserId !== null,
    });
  }

  protected async signIn(event: Event): Promise<void> {
    event.preventDefault();

    if (this.submitting()) {
      return;
    }

    if (this.loginForm().invalid()) {
      this.errorMessage.set(INVALID_CREDENTIALS_MESSAGE);
      return;
    }

    const { userId, password, rememberUser } = this.model();
    this.errorMessage.set(null);
    this.submitting.set(true);

    try {
      await firstValueFrom(this.auth.signIn({ userId, password }));
      await (rememberUser ? this.preferences.rememberUserId(userId) : this.preferences.forgetUserId());
      await this.navigation.navigateRoot(APP_ROUTES.products, { animated: true, animationDirection: 'forward' });
    } catch (error) {
      this.errorMessage.set(this.messageFor(error));
    } finally {
      this.submitting.set(false);
    }
  }

  private messageFor(error: unknown): string {
    const isUnauthorized = error instanceof HttpErrorResponse && error.status === HttpStatusCode.Unauthorized;

    return isUnauthorized ? INVALID_CREDENTIALS_MESSAGE : UNEXPECTED_ERROR_MESSAGE;
  }
}
