interface IService<R, T> {
    // [key: string]: any
    handle(args: T): R
  }
  interface Callable { call: Function }
  function decorator(target: new (...args: any[]) => IService<any, any> & {} & any) {
    return class extends target implements Callable {
      constructor() {
        super("")
  
        this.handle = function(...args:any[]){
          console.log("Changed from constructer")
        }
      }
      call(){
  
      }
     handle(args: any) {
        console.log(args)
        super.handle(args)
      }
    }
  }
  
  const logParameters: {
    target: Object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  }[] = []
  
  function logParameter(): ParameterDecorator {
    return function (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) {
      logParameters.push({ target, propertyKey, parameterIndex })
    }
  }
  function methodDecorator<T>(): MethodDecorator {
    return function (target: IService<any, any> & Object, key: string | symbol, descriptor: TypedPropertyDescriptor<Function>) {
      //  console.log(target)
      const originalMethod = descriptor.value!
      descriptor.value = function (...args: any[]) {
        args.push("baz")
        // originalMethod.apply(this, args.map((arg, index) => index === prismaIndex ? "PrismaInstance" : arg))
        originalMethod(...args.map((arg, index) => index === logParameters.find(l => {
          return l.target.constructor.name === target.constructor.name || l.target === target
        })?.parameterIndex
          ? "PrismaInstance" : arg
  
        ))
      }
    }
  }
  
  @decorator
  class Foo implements IService<void, string> {
    //constructor(@logParameter public readonly prisma: string) { }
    @methodDecorator()
    handle(@logParameter() arg: string, baz: string): void {
      console.log("ok", arg, baz)
    }
  }
  
  new Foo().handle("test")
  
  