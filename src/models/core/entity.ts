export interface ICreateOnlyEntity {
  readonly createdAt: Date;
}
export interface IEntity extends ICreateOnlyEntity {
  readonly id: string;
}
// export interface IRoot<T extends Record<string, any>> {
//   [K: string]: T;
// }
export type IRoot<T> = T ;

export interface IValueObject {}

export abstract class Entity implements IEntity {
  constructor(public readonly id: string, public readonly createdAt: Date) {}
}

export abstract class BaseRoot<T> {}
