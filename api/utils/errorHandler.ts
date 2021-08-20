import { Context } from "../deps.ts";

async function errorHandler({ response }: Context, next: () => void) {
  try {
    await next();
  } catch (e) {
    response.body = e.message;
    response.status = e.status;
  }
}
export default errorHandler;
