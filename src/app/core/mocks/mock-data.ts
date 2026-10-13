import { AccountDto, CredentialsDto, CreditCardDto, SignInResponseDto, UserDto } from '../models/api.dto';

export const MOCK_CREDENTIALS: CredentialsDto = {
  userId: '00100010321',
  password: '1111',
};

export const MOCK_SIGN_IN_RESPONSE: SignInResponseDto = {
  access_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDEwMDAxMDMyMSJ9.kPLjCmPJaw8jaOu0cEp4sXR0e52YRrj97OCGJaQGzA4',
  refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dw8gT8j5mKQbY8dVK453_dRICvBSg2oAQYFfzO1rpoY',
};

export const MOCK_USER: UserDto = {
  name: 'José',
  lastName: 'Pérez',
  photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
};

export const MOCK_ACCOUNTS: readonly AccountDto[] = [
  { alias: 'Cuenta de ahorros 1', number: '1234567890001', availableAmount: 100000, productType: 'AC' },
  { alias: 'Cuenta de ahorros 2', number: '1234567890002', availableAmount: 200000, productType: 'AC' },
];

export const MOCK_CREDIT_CARDS: readonly CreditCardDto[] = [
  {
    alias: 'Tarjeta de crédito 1',
    number: '0987 6543 2109 0001',
    availableAmountRD: 1000000,
    availableAmountUS: 1000,
    isInternational: true,
    productType: 'TC',
  },
  {
    alias: 'Tarjeta de crédito 2',
    number: '0987 6543 2109 0002',
    availableAmountRD: 2000000,
    availableAmountUS: 0,
    isInternational: false,
    productType: 'TC',
  },
];
