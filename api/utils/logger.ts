import { ensureFile, getLogger, handlers, setup, LogRecord } from "../deps.ts";
import configs from "../config/config.ts";

const { env } = configs;
const currentDate = new Date().toLocaleString();
const dateForFileName = currentDate.replace(/\//g, "-").replace(/:/g, "_");
const logFileLocation = `./logs/${dateForFileName} [${env}].log`;

// Create log file if it doesn't exist
await ensureFile(logFileLocation);

function normalizeMessage(msg: string) {
  const isFistMessageAnObject = !!msg.match(/^\{".+?":.+\}$/);
  if (!isFistMessageAnObject) return msg;
  return JSON.stringify(JSON.parse(msg), null, 2);
}

function normalizeObject(obj: Record<string, unknown> | string) {
  if (typeof obj === "object") {
    obj = JSON.stringify(obj, null, 2);
    return obj;
  }
  return obj;
}

function normalizeArgs(args: unknown[]) {
  let result = "";
  args.forEach(
    (arg) =>
      (result += ` ${normalizeObject(arg as Record<string, unknown> | string)}`)
  );
  return result;
}

function formatter(logRecord: LogRecord) {
  const { levelName, args, msg } = logRecord;
  return `\n[${levelName}] ${normalizeMessage(msg)}${normalizeArgs(args)}`;
}

function formatterWithDatetime(logRecord: LogRecord) {
  const time = new Date().toISOString();
  const { levelName, args, msg } = logRecord;
  return `\n${time} [${levelName}] ${normalizeMessage(msg)}${normalizeArgs(
    args
  )}`;
}

await setup({
  handlers: {
    console: new handlers.ConsoleHandler("DEBUG", { formatter }),
    file: new handlers.FileHandler("DEBUG", {
      filename: logFileLocation,
      formatter,
    }),

    productionConsole: new handlers.ConsoleHandler("INFO", {
      formatter: formatterWithDatetime,
    }),
    productionFile: new handlers.FileHandler("INFO", {
      filename: logFileLocation,
      formatter: formatterWithDatetime,
    }),
  },

  loggers: {
    development: { level: "DEBUG", handlers: ["console", "file"] },
    tests: { level: "DEBUG", handlers: ["console", "file"] },
    production: {
      level: "INFO",
      handlers: ["productionConsole", "productionFile"],
    },
  },
});

let log = getLogger("development");
if (env === "test") log = getLogger("tests");
if (env === "production") log = getLogger("production");

export { log };
