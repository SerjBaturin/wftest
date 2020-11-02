import * as express from "express";
import * as morgan from "morgan";
import * as cors from "cors";
import * as cookieParser from "cookie-parser";
import { json, urlencoded } from "body-parser";
import * as Sentry from "@sentry/node";
import { MongoClient } from "mongodb";

import { router } from "./router";

import { DbService } from "./services/db";
import { isDevelopment } from "./utils/composition";
import { mongoUrl } from "@config/db.config";

const client = new MongoClient(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bootstrap = async () => {
  await client.connect();

  const app = express();

  app.locals.dbService = new DbService(client.db());

  if (!isDevelopment) {
    Sentry.init({
      dsn: "https://8baa310a7c70481eb070fab76fd4fe5c@sentry.io/5181022",
    });
    app.use(Sentry.Handlers.requestHandler());
  }

  app.use(morgan("common"));
  app.use(cookieParser());
  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
  );

  app.use("/api", router);

  if (!isDevelopment) {
    app.use(Sentry.Handlers.errorHandler());
  }

  return app;
};

export default bootstrap;
