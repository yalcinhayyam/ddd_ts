import { injectable } from "tsyringe";
export interface ILogger {
  log(message: any): void;
}

@injectable()
export class ConsoleLogger implements ILogger {
  log(message: any) {
    console.log(message);
  }
}
