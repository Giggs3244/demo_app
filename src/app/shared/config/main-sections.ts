export interface MainSection {
  readonly path: string;
  readonly label: string;
  readonly icon: string;
}

export interface NavigationLink {
  readonly url: string;
  readonly label: string;
  readonly icon: string;
}

export const TABS_URL = '/tabs';

export const MAIN_SECTIONS: readonly MainSection[] = [
  { path: 'products', label: 'Mis productos', icon: 'assets/icons/save-money-30-gray.svg' },
  { path: 'transactions', label: 'Transacciones', icon: 'assets/icons/pay-30-gray.svg' },
  { path: 'offers', label: 'Ofertas', icon: 'assets/icons/offers-30-gray.svg' },
  { path: 'configuration', label: 'Configuración', icon: 'assets/icons/config-30-gray.svg' },
];

export const MAIN_SECTION_LINKS: readonly NavigationLink[] = MAIN_SECTIONS.map(({ path, label, icon }) => ({
  url: `${TABS_URL}/${path}`,
  label,
  icon,
}));

export const SUPPORT_LINKS: readonly NavigationLink[] = [
  { url: '/contact', label: 'Contacto', icon: 'assets/icons/contact-24-green.svg' },
  { url: '/branches', label: 'Sucursales', icon: 'assets/icons/branches-24-green.svg' },
];
