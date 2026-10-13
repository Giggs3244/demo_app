import { environment } from '../../../environments/environment';

export const API_ENDPOINTS = {
  signIn: `${environment.apiUrl}/sign_in`,
  user: `${environment.apiUrl}/user`,
  accounts: `${environment.apiUrl}/accounts`,
  creditCards: `${environment.apiUrl}/credit_cards`,
} as const;
