export interface MainSection {
  readonly path: string;
  readonly label: string;
  readonly icon: string;
}

export const MAIN_SECTIONS: readonly MainSection[] = [
  { path: 'products', label: 'Mis productos', icon: 'assets/icons/save-money-30-gray.svg' },
  { path: 'transactions', label: 'Transacciones', icon: 'assets/icons/pay-30-gray.svg' },
  { path: 'offers', label: 'Ofertas', icon: 'assets/icons/offers-30-gray.svg' },
  { path: 'configuration', label: 'Configuración', icon: 'assets/icons/config-30-gray.svg' },
];
