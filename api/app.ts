import { Application } from "./deps.ts";
import { oakCors } from "./deps.ts";
import logger from "./utils/logger.ts";
import errorHandler from "./utils/errorHandler.ts";
import routes from "./routes/main.ts";
import { PORT } from "./config/main.ts";

const app = new Application();

logger(app);
app.use(errorHandler);
app.use(oakCors());
app.use(routes.routes());

console.log(`Server is listening on ${PORT}...`);
await app.listen({ port: PORT });
