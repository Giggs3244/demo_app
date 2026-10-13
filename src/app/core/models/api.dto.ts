export interface CredentialsDto {
  readonly userId: string;
  readonly password: string;
}

export interface SignInResponseDto {
  readonly access_token: string;
  readonly refresh_token: string;
}

export interface UserDto {
  readonly name: string;
  readonly lastName: string;
  readonly photo: string;
}

export interface AccountDto {
  readonly alias: string;
  readonly number: string;
  readonly availableAmount: number;
  readonly productType: 'AC';
}

export interface CreditCardDto {
  readonly alias: string;
  readonly number: string;
  readonly availableAmountRD: number;
  readonly availableAmountUS: number;
  readonly isInternational: boolean;
  readonly productType: 'TC';
}

export type ProductDto = AccountDto | CreditCardDto;
