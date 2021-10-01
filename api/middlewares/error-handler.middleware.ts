import configs from "../config/config.ts";
import { Context, isHttpError } from "../deps.ts";
import { log } from "../utils/logger.ts";
import ErrorHelper from "../helpers/error.helper.ts";

const { env } = configs;

export async function errorHandler(
  { response }: Context,
  next: () => Promise<unknown>
) {
  try {
    await next();
  } catch (err) {
    let message = err.message;
    const name = err.name;
    const path = err.path;
    const type = err.type;
    const status =
      err.status || err.statusCode || ErrorHelper.status.internalServerError;

    if (!isHttpError(err))
      message = env === "development" ? message : "Internal Server Error";

    log.error(err);
    response.status = status;
    response.body = { message, name, path, type, status };
  }
}
