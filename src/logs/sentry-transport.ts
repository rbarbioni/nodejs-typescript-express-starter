import sentry from "@sentry/node";
import _ from "lodash";
import TransportStream = require("winston-transport");

const errorHandler = (err: any) => {
  // eslint-disable-next-line
  console.error(err);
};

export interface Context {
  message?: string;
  fullMessage?: string;
  level?: any;
  extra?: any;
  fingerprint?: any;
}

export default class SentryTransport extends TransportStream {
  protected name: string;

  protected tags: { [s: string]: any };

  protected sentryClient: typeof sentry;

  protected levelsMap: any;

  constructor(opts: any, tags: any) {
    super(opts);
    this.name = "winston-sentry-log";
    this.tags = tags;
    const options = opts;

    _.defaultsDeep(opts, {
      errorHandler,
      config: {
        dsn: process.env.SENTRY_DSN || "",
        logger: "winston-sentry-log",
        captureUnhandledRejections: false,
      },
      isClientInitialized: false,
      level: "info",
      levelsMap: {
        silly: "debug",
        verbose: "debug",
        info: "info",
        debug: "debug",
        warn: "warning",
        error: "error",
      },
      name: "winston-sentry-log",
      silent: false,
    });

    this.levelsMap = options.levelsMap;

    if (options.tags) {
      this.tags = options.tags;
    } else if (options.globalTags) {
      this.tags = options.globalTags;
    } else if (options.config.tags) {
      this.tags = options.config.tags;
    }

    if (options.extra) {
      options.config.extra = options.config.extra || {};
      options.config.extra = _.defaults(options.config.extra, options.extra);
    }

    this.sentryClient = options.sentryClient;

    if (!options.isClientInitialized) {
      // eslint-disable-next-line global-require
      this.sentryClient = this.sentryClient || require("@sentry/node");

      this.sentryClient.init(
        options.config || {
          dsn: process.env.SENTRY_DSN || "",
        }
      );
    }

    if (this.sentryClient) {
      this.sentryClient.configureScope((scope: any) => {
        scope.clear();
        if (!_.isEmpty(this.tags)) {
          Object.keys(this.tags).forEach((key) => {
            scope.setTag(key, this.tags[key]);
          });
        }
      });
    }
  }

  public log(
    info: any,
    callback: any
  ): ((a: null, b: boolean) => unknown) | undefined {
    const { message, stack } = info;
    const level = Object.keys(this.levelsMap).find((key) =>
      info.level.toString().includes(key)
    );
    if (!level) {
      return callback(null, true);
    }

    const meta = { ..._.omit(info, ["level", "message", "label"]) };
    setImmediate(() => {
      this.emit("logged", level);
    });

    if (this.silent) {
      return callback(null, true);
    }

    const context: Context = {};
    context.level = this.levelsMap[level];
    context.extra = _.omit(meta, ["user", "tags"]);

    this.sentryClient.withScope((scope: sentry.Scope) => {
      scope.clear();
      const user = _.get(meta, "user");
      if (_.has(context, "extra")) {
        Object.keys(context.extra).forEach((key) => {
          scope.setExtra(key, context.extra[key]);
        });
      }

      if (!_.isEmpty(meta.tags) && _.isObject(meta.tags)) {
        Object.keys(meta.tags).forEach((key) => {
          scope.setTag(key, meta.tags[key]);
        });
      }
      if (context.level) {
        scope.setLevel(context.level);
      }

      if (stack) {
        scope.setExtra("stack", stack);
      }

      if (message) {
        scope.setFingerprint(message);
      }

      const splat = info[Symbol.for("splat")];
      if (splat) {
        if (_.isArray(splat)) {
          const fullMessage = splat[0];

          if (_.isString(fullMessage)) context.fullMessage = fullMessage;

          splat.forEach((item) => {
            if (_.isObject(item)) {
              Object.keys(item).forEach((key) => {
                scope.setExtra(key, (item as any)[key]);
              });
            }
          });
        }
      }

      if (user) {
        scope.setUser(user);
      }

      this.sentryClient.captureMessage(message, context);
      return callback(null, true);
    });
    return undefined;
  }
}

module.exports = SentryTransport;
