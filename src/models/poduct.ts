/*
    Example with getters its most strict example but to much effort
*/
import { v4 as newGuid } from "uuid";
import { IOption, IProduct } from "./common";
import { IEntity, IRoot } from "./core/entity";
import { IPrice } from "./data/price";

abstract class Entity {}

class Product extends Entity implements IRoot<IProduct>, IEntity, IProduct {
  static from(model: IProduct): Product {
    return new Product(model.id, model.createdAt, model.title, [
      ...model.options,
    ]);
  }

  private constructor(
    private readonly _id: string,
    private readonly _createdAt: Date,
    private _title: string,
    private _options: IOption[]
  ) {
    super();
  }
  get createdAt(): Readonly<Date> {
    return this._createdAt;
  }

  get title(): Readonly<string> {
    return this._title;
  }
  get options():
    | readonly Readonly<IOption>[]
    | ReadonlyArray<Readonly<IOption>> {
    return this._options;
  }
  get id(): string {
    return this._id;
  }

  static create(title: string): Product {
    return new Product(newGuid(), new Date(), title, []);
  }

  addOption(key: string, price: IPrice): void {
    this._options.push({ id: "IID", key, price, createdAt: new Date() });
  }
}
{
  const product = Product.create("Abc");
  product.addOption("s", { amount: 10.3, currency: "TL" });
  console.log(product);
}

{
  const product: IProduct = {
    id: newGuid(),
    createdAt: new Date(),
    title: "test title",
    options: [],
  };
  const instance = Product.from(product);
  instance.addOption("m", { amount: 10.3, currency: "TL" });
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
