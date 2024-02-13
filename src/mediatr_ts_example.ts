import { Mediator, requestHandler, mediatorSettings, pipelineBehavior } from "mediatr-ts";

// request.ts -> Define the request
class FooRequest implements IRequest<string> {
  constructor(public name: string) {}
}

// handlertest.ts -> Add the attribute to the request handler
@requestHandler(FooRequest)
class HandlerTest implements IRequestHandler<FooRequest, string> {
  handle(value: FooRequest): Promise<string> {
    return Promise.resolve(`Value passed ${value.name}`);
  }
}

@pipelineBehavior()
class PipelineBehaviorTest1 implements IPipelineBehavior {
  async handle(
    request: IRequest<unknown>,
    next: () => unknown
  ): Promise<unknown> {
    console.log('PipelineBehaviorTest1' ,request)
    return true;
  }
}

@pipelineBehavior()
class PipelineBehaviorTest2 implements IPipelineBehavior {
  async handle(
    request: IRequest<unknown>,
    next: () => unknown
  ): Promise<unknown> {
    console.log('PipelineBehaviorTest2' ,request)
    return true;
  }
}

// Set the order of the pipeline behaviors. PipelineBehaviorTest2 will be executed first, and then PipelineBehaviorTest1.
mediatorSettings.dispatcher.behaviors.setOrder([
  PipelineBehaviorTest2,
  PipelineBehaviorTest1,
]);

// main.ts -> Instantiate the mediator
const mediator = new Mediator();

// Create the request
const r = new FooRequest("Foo");

// Send the command
mediator.send<string>(r);

// result = "Value passed Foo"
