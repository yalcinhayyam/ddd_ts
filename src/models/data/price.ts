import { IValueObject } from "../core/entity";

export interface IPrice extends IValueObject {
  readonly currency: string;
  readonly amount: number;
}
export function PriceClass(): new (currency: string, amount: number) => IPrice {
  //   currency: string,
  //   amount: number
  return class implements IPrice {
    constructor(
      public readonly currency: string,
      public readonly amount: number
    ) {}
  };
}

function PriceInstance(currency: string, amount: number): IPrice {
  return new (class implements IPrice {
    constructor(
      public readonly currency: string,
      public readonly amount: number
    ) {}
  })(currency, amount);
}

function Price(currency: string, amount: number): IPrice {
  return new (class implements IPrice {
    constructor(
      public readonly currency: string,
      public readonly amount: number
    ) {}
  })(currency, amount);
}