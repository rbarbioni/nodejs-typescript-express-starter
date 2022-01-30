/* eslint-disable import/first */
// eslint-disable-next-line import/newline-after-import
import dotent from "dotenv";
dotent.config();

import express from "express";
import cors from "cors";
import config from "config";
import * as Sentry from "@sentry/node";

import routes from "./routes/index";

// Create the express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
app.use(routes);
app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);

const PORT = config.get("port") || 3000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
