import configs from "../config/config.ts";
import { Context, isHttpError } from "../deps.ts";
import log from "./logger.middleware.ts";
import ErrorHelper from "../helpers/error.helper.ts";

export const errorHandler = async (
  { response }: Context,
  next: () => Promise<unknown>,
) => {
  try {
    await next();
  } catch (err) {
    let message = err.message;
    const name = err.name;
    const path = err.path;
    const type = err.type;
    const status = err.status || err.statusCode ||
      ErrorHelper.status.internalServerError;

    const { env } = configs;
    if (!isHttpError(err)) {
      message = env === "dev" || env === "development"
        ? message
        : "Internal Server Error";
    }

    if (env === "dev" || env === "development") {
      log.debug(err);
    }

    response.status = status;
    response.body = { message, name, path, type, status };
  }
};
