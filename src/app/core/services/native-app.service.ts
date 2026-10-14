import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';

@Injectable({ providedIn: 'root' })
export class NativeAppService {
  exit(): Promise<void> {
    return App.exitApp();
  }
}
