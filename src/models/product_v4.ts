/*
    Example with readonly fields and from and create operations returns root
*/

import { IOption, IProduct } from "./common";
import { Entity, IEntity, IRoot } from "./core/entity";
import { IPrice } from "./data/price";


interface IProductRoot extends IRoot<IProduct> {
  addOption(key: string, price: IPrice): void;
  changeTitle(title: string): void;
  changeOptionKey(optionId: string, newKey: string): void;
}

class Product extends Entity implements IProductRoot, IEntity {
  private constructor(
    id: string,
    createdAt: Date,
    public title: string,
    public readonly options: IOption[]
  ) {
    super(id, createdAt);
  }
  changeTitle(title: string): void {
    this.title = title;
  }
  static from(model: IProduct): IProductRoot | Readonly<IProductRoot> {
    return new Product(model.id, model.createdAt, model.title, [
      ...model.options,
    ]);
  }

  static create(title: string): IProductRoot | Readonly<IProductRoot> {
    return new Product("PRODUCT_ID", new Date(), title, []);
  }

  addOption(key: string, price: IPrice): void {
    this.options.push({ id: "IID", key, price, createdAt: new Date() });
  }
  changeOptionKey(optionId: string, newKey: string) {
    const option = this.options.find((option) => option.id === optionId);
    if (!option) {
      throw new Error(`Option not found with id ${optionId}`);
    }
    option!.key = newKey;
  }
}
{
  const product = Product.create("Abc");
  product.addOption("s", { amount: 10.3, currency: "TL" });

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
  instance.changeOptionKey("IID", "sx");

  // instance.id = "";
  // instance.options[0].key = "";
  // instance.options = [];
  // instance.options.push({
  //   id: "IID",
  //   amount: 10.3,
  //   currency: "TL",
  //   createdAt: new Date(),
  // });

  console.log(instance);
}
