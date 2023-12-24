import { IEntity } from "./core/entity";
import { IPrice } from "./data/price";

export interface IOption extends IEntity {
  key: string;
  price: IPrice;
}

export interface IProduct extends IEntity {
  readonly title: string;
  readonly options:
    | readonly Readonly<IOption>[]
    | ReadonlyArray<Readonly<IOption>>;
}
