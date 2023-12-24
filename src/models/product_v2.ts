/*
    Example with readonly fields and private _options field with IProductRoot
*/

import { IOption, IProduct } from "./common";
import { Entity, IEntity, IRoot } from "./core/entity";
import { IPrice, PriceClass } from "./data/price";

interface IProductRoot extends IProduct, IRoot<IProduct>, IEntity {
  addOption(key: string, price: IPrice): void;
  changeTitle(title: string): void;
  changeOptionKey(optionId: string, newKey: string): void;
}

class Product extends Entity implements IProductRoot {
  private _options: IOption[];

  private constructor(
    id: string,
    createdAt: Date,
    public title: string,
    public readonly options:
      | readonly Readonly<IOption>[]
      | ReadonlyArray<Readonly<IOption>>
  ) {
    super(id, createdAt);
    this._options = [...options];
  }
  changeTitle(title: string): void {
    this.title = title;
  }
  static from(model: IProduct): Readonly<Product> {
    return new Product(model.id, model.createdAt, model.title, [
      ...model.options,
    ] as const);
  }

  static create(title: string): Readonly<Product> {
    return new Product("PRODUCT_ID", new Date(), title, [] as const);
  }

  addOption(key: string, price: IPrice): void {
    this._options.push({ id: "IID", key, price, createdAt: new Date() });
  }

  changeOptionKey(optionId: string, newKey: string) {
    const option = this._options.find((option) => option.id === optionId);
    if (!option) {
      throw new Error(`Option not found with id ${optionId}`);
    }
    option!.key = newKey;
  }
}
{
  const product = Product.create("Abc");
  product.addOption("s", new (PriceClass())("TL", 10.3));
  //product.id = "";
  console.log(product);
}

{
  const product: IProduct = {
    id: "PRODUCT_ID",
    createdAt: new Date(),
    title: "first title",
    options: [],
  };
  const instance = Product.from(product);
  instance.addOption("m", { amount: 10.3, currency: "TL" });
  instance.changeTitle("Title Changed");
  // instance.id = "";
  // instance.options[0].key = "";
  // instance.options = [];
  // instance.options.push({
  //   id: "IID",
  //   amount: 10.3,
  //   currency: "TL",
  //   createdAt: new Date(),
  // });
  instance.changeOptionKey("IID", "sx");
  console.log(instance);
}
