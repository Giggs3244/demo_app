import { Account } from '../models/account.model';
import { AccountDto, CreditCardDto, ProductDto } from '../models/api.dto';
import { CreditCard } from '../models/credit-card.model';
import { Product } from '../models/product.model';

export class ProductFactory {
  static create(dto: ProductDto): Product {
    switch (dto.productType) {
      case 'AC':
        return ProductFactory.createAccount(dto);
      case 'TC':
        return ProductFactory.createCreditCard(dto);
      default:
        throw new Error(`Unsupported product type: ${(dto as { productType: string }).productType}`);
    }
  }

  static createAccount(dto: AccountDto): Account {
    return new Account(dto.alias, dto.number, dto.availableAmount);
  }

  static createCreditCard(dto: CreditCardDto): CreditCard {
    return new CreditCard(dto.alias, dto.number, dto.availableAmountRD, dto.availableAmountUS, dto.isInternational);
  }
}
