import { container } from "tsyringe";

export interface INotification {
  readonly info: NotificationInfo;
}

export type NotificationInfo = {
  type: new (...args: any[]) => AbstractNotification;
};
export abstract class AbstractNotification {
  // readonly info: NotificationInfo = {} as NotificationInfo;
  // constructor(type: new (...args: any[]) => AbstractNotification) {
  //   this.info = {
  //     type,
  //   };
  // }
  // publishedAt: Date
}

type Notification<T extends AbstractNotification = any> = new (
  ...args: any[]
) => T;

type NotificationHandler<T extends AbstractNotification = any> = new (
  ...args: any[]
) => AbstractNotificationHandler<T>;

type Subscriber<T extends AbstractNotification = any> = {
  notification: Notification<T>;
  handlers: NotificationHandler<T>[];
};

export abstract class AbstractNotificationHandler<
  T extends AbstractNotification
> {
  abstract handle(notification: T): void;
}

export function Notification<
  T extends { new (...args: any[]): AbstractNotification }
>(target: T) {
  return class extends target {
    info = {
      type: target,
    };
  };
}



export function NotificationHandler<T extends AbstractNotification>(
  notification: Notification<T>
) {
  return function (target: NotificationHandler<T>) {
    Publisher.subscribe(notification, target);
  };
}

export class Publisher {
  private static readonly subscribers: Subscriber[] = [];
  static subscribe<T extends AbstractNotification>(
    notification: Notification<T>,
    handler: NotificationHandler<T>
  ) {
    const notation = Publisher.subscribers.find(
      (n) => n.notification.name === notification.name
    );

    if (!notation) {
      Publisher.subscribers.push({
        notification: notification,
        handlers: [handler],
      });
      return;
    }
    notation.handlers.push(handler);
  }

  static publish(notification: AbstractNotification) {
    const notation = this.subscribers.find(
      (n) =>
        n.notification.name === (notification as INotification).info.type.name
    );
    if (!notation) {
      throw new Error("Notation not found");
    }
    notation.handlers.forEach(
      (handler) => container.resolve(handler).handle(notification)
      //   handler.prototype.handle(notification)
    );
  }
}
