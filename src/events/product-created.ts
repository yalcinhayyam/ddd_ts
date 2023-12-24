import { LOGGER } from "../constant";
import { ILogger } from "../utilities/logger";
import {
  AbstractNotificationHandler,
  AbstractNotification,
  NotificationHandler,
  NotificationInfo,
  Notification,
} from "../utilities/publisher";
import { injectable, inject } from "tsyringe";

@Notification
export class ProductCreatedEvent extends AbstractNotification {
  constructor(public readonly productId: string) {
    super();
    // super(ProductCreatedEvent);
  }
}

@injectable()
@NotificationHandler(ProductCreatedEvent as any)
class ProductCreatedEventHandler
  implements AbstractNotificationHandler<ProductCreatedEvent>
{
  constructor(@inject(LOGGER) private readonly _logger: ILogger) {}
  handle(notification: ProductCreatedEvent): void {
    this._logger.log(notification.productId);
  }
}
