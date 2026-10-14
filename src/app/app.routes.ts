import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { PlaceholderPageData } from './features/placeholder/placeholder.page';

const loadPlaceholderPage = () => import('./features/placeholder/placeholder.page').then((m) => m.PlaceholderPage);

const placeholder = (data: PlaceholderPageData) => ({ loadComponent: loadPlaceholderPage, data });

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'tabs',
    canActivate: [authGuard],
    loadComponent: () => import('./features/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'products',
        loadComponent: () => import('./features/products/products.page').then((m) => m.ProductsPage),
      },
      {
        path: 'transactions',
        ...placeholder({ title: 'Transacciones', heading: 'Pantalla\nde transacciones' }),
      },
      {
        path: 'offers',
        ...placeholder({ title: 'Ofertas', heading: 'Pantalla\nde ofertas' }),
      },
      {
        path: 'configuration',
        ...placeholder({ title: 'Configuración', heading: 'Pantalla\nde configuración' }),
      },
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
