import "reflect-metadata";
import { container } from "tsyringe";
import { ConsoleLogger } from "./utilities/logger";
import { LOGGER } from "./constant";
import { Publisher } from "./utilities/publisher";
import { ProductCreatedEvent } from "./events/product-created";
import { v4 } from "uuid";
import "./models/product_v4"
container.register(LOGGER, ConsoleLogger);


Publisher.publish(new ProductCreatedEvent(v4()));
Publisher.publish(new ProductCreatedEvent(v4()));
Publisher.publish(new ProductCreatedEvent(v4()));
Publisher.publish(new ProductCreatedEvent(v4()));

const foo = { baz: 10 as const } as const;
