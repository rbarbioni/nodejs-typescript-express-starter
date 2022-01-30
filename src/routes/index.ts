import express, { Request, Response } from "express";
import log from "../logs/log";
import { fooSuccess, fooError } from "../services/foo-service";
import AppError from "../errors";

const router = express.Router();

router.get("/sucess", (req: Request, res: Response) => {
  fooSuccess();
  log.info("sucess");
  return res.send("OK");
});

router.get("/error", async (req: Request, res: Response) => {
  try {
    fooError({
      email: "email@email.com.br",
      password: "email123",
    });
    return res.send({
      sucess: true,
    });
  } catch (e) {
    if (e instanceof AppError) {
      const error: AppError = e;
      log.error(error);
    } else {
      log.error("FooError", e);
    }
    return res.sendStatus(500);
  }
});

export default router;
