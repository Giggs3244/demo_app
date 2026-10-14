import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { onboardingGuard } from './core/guards/onboarding.guard';
import { productExistsGuard } from './core/guards/product-exists.guard';
import { PlaceholderPageData } from './features/placeholder/placeholder.page';

const loadPlaceholderPage = () => import('./features/placeholder/placeholder.page').then((m) => m.PlaceholderPage);

const placeholder = (data: PlaceholderPageData) => ({ loadComponent: loadPlaceholderPage, data });

export const routes: Routes = [
  {
    path: 'onboarding',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/onboarding/onboarding.page').then((m) => m.OnboardingPage),
  },
  {
    path: 'login',
    canActivate: [guestGuard, onboardingGuard],
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
    path: 'product/:type/:digits',
    canActivate: [authGuard, productExistsGuard],
    loadComponent: () => import('./features/product-detail/product-detail.page').then((m) => m.ProductDetailPage),
  },
  {
    path: 'contact',
    ...placeholder({ title: 'Contacto', heading: 'Pantalla\nde contacto', leading: 'back' }),
  },
  {
    path: 'branches',
    ...placeholder({ title: 'Sucursales', heading: 'Pantalla\nde sucursales', leading: 'back' }),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
