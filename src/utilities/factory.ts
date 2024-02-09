


abstract class AE { }

class EE implements AE { }


// console.log(new EE() instanceof AE)

interface IFoo {
    readonly id: number
    readonly baz: string
}
class Foo implements IFoo {
    private constructor(public id: number, public baz: string) { }

    static create(baz: string): IFoo {
        return new Foo(Math.random(), baz);
    }

}

class EntityFactory {
    static convert<AbstarctType, Type extends new (...args: ConstructorParameters<Type>) => InstanceType<Type> & AbstarctType>(type: Type, ...args: ConstructorParameters<Type>): InstanceType<Type & AbstarctType> {
        return new type(...args)
    }
}


console.log(
    Foo.create("test") instanceof Foo,
    EntityFactory.convert<IFoo, typeof Foo>(Foo, 1, "") instanceof Foo,
)