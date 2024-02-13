const keys = new Map<string, any>()
function transformArgument(target: any, key: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    var argIndex = keys.get("addValue")
    args[argIndex] = args[argIndex] + 10; // Modify the first argument, for example

    return originalMethod.apply(this, args);
  };

  return descriptor;
}

function Arg() {
  return function (target: Object, propertyKey: string, index: number) {
    keys.set(propertyKey, index)
  }
}

class Example {
  @transformArgument
  addValue( value: number,@Arg() value2: number) {
    console.log(value,value2);
  }
}

const example = new Example();
example.addValue(5,7); // This will log 15 (5 + 10)



interface MyInterface {
  someMethod(): void;
}

function implementsInterface(constructor: any) {
  return class extends constructor implements MyInterface {
    someMethod() {
      console.log('Implemented method');
    }

    // You may choose to call the original constructor
    constructor(...args: any[]) {
      super(...args);
    }
  };
}

@implementsInterface
class MyClass {
  // Your original class implementation
}

const myInstance = new MyClass();


myInstance.someMethod(); // This should work since MyClass now implements MyInterface


interface IRequest<T> {
  // Belirli bir içerik olmadan, sadece tip bilgisi
}

class CreateProductCommand implements IRequest<number> {
  constructor(public productName: string, public price: number) {}
}



interface IRequestHandler<TRequest, TResponse> {
  handle(request: TRequest): Promise<TResponse>;
}

interface IPipelineBehavior<TRequest = any, TResponse = any> {
  handle(request: TRequest, next: () => Promise<TResponse>): Promise<TResponse>;
}

class LoggingBehavior<TRequest = any, TResponse = any> implements IPipelineBehavior<TRequest, TResponse> {
  async handle(request: TRequest, next: () => Promise<TResponse>): Promise<TResponse> {
    console.log(`Handling request: ${JSON.stringify(request)}`);
    
    const response = await next();
    
    console.log(`Handled response: ${JSON.stringify(response)}`);
    
    return response;
  }
}

class CachingBehavior<TRequest = any, TResponse = any> implements IPipelineBehavior<TRequest, TResponse> {
  async handle(request: TRequest, next: () => Promise<TResponse>): Promise<TResponse> {
    console.log(`Cached request: ${JSON.stringify(request)}`);
    
    const response = await next();
    
    console.log(`Cached response: ${JSON.stringify(response)}`);
    
    return response;
  }
}


function RegisterPipelineBehavior<TRequest = any, TResponse = any>(
  behavior: IPipelineBehavior<TRequest, TResponse>
): ClassDecorator {
  return function <T extends { new(...args: any[]): IRequestHandler<TRequest, TResponse> }>(constructor: T): T {
    return class extends constructor {
      async handle(request: TRequest): Promise<TResponse> {
        return behavior.handle(request, async () => super.handle(request));
      }
    };
  };
}

@RegisterPipelineBehavior(new LoggingBehavior<CreateProductCommand, number>())
@RegisterPipelineBehavior(new CachingBehavior<CreateProductCommand, number>())
class CreateProductCommandHandler implements IRequestHandler<CreateProductCommand, number> {
  async handle(request: CreateProductCommand): Promise<number> {
    // Burada CreateProductCommand ile ilgili işlemler gerçekleştirilir.
    // Şu an sadece örnek bir sayı döndürüyorum.
    return 42;
  }
}

// Kullanım örneği
const createProductHandler = new CreateProductCommandHandler();
createProductHandler.handle(new CreateProductCommand("Product", 29.99));


