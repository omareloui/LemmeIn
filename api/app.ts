import { Application, oakCors } from "./deps.ts";
import { errorHandler } from "./middlewares/error-handler.middleware.ts";
import logger from "./utils/logger.ts";
import log from "./middlewares/logger.middleware.ts";
import configs from "./config/config.ts";
import router from "./routers/index.ts";

const { url, port, clientUrl } = configs;

const app = new Application();

const corsOptions = {
  origin: clientUrl,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true,
};

logger(app);
app.use(oakCors(corsOptions));
app.use(errorHandler);

router.init(app);

app.addEventListener("listen", () => {
  log.info(`Server listening at ${url}`);
});

if (import.meta.main) {
  await app.listen({ port });
}

export { app };
