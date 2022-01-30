import winston from "winston";
import express from "express";
import config from "config";
import * as Sentry from "@sentry/node";
import * as SentryTracing from "@sentry/tracing";
import { hostname } from "os";
import SentryTransport from "./sentry-transport";

const app = express();

const NODE_ENV = process.env.NODE_ENV || "local";

const isProduction = (): boolean => ["prod", "production"].includes(NODE_ENV);

const transports = [];

transports.push(
  new winston.transports.Console({
    level: config.get("logLevel") || "info",
  })
);

const defaultTags = {
  team: "squad-name",
  application: process.env.npm_package_name,
  host: hostname(),
  environment: NODE_ENV,
};

if (isProduction()) {
  const sentryConfig = {
    dsn: process.env.SENTRY_DSN,
    debug: true,
    release: `${defaultTags.application}@${process.env.npm_package_version}`,
    environment: NODE_ENV,
    tracesSampleRate: 1.0,
    attachStacktrace: true,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new SentryTracing.Integrations.Express({ app }),
    ],
  };

  Sentry.init(sentryConfig);
  transports.push(
    new SentryTransport(
      {
        isClientInitialized: true,
        sentryClient: Sentry,
      },
      defaultTags
    )
  );
}

const logger = winston.createLogger({
  level: "error",
  transports,
});

export default logger;
