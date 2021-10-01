import configs from "../config/config.ts";
import { MongoClient } from "../deps.ts";
import log from "../middlewares/logger.middleware.ts";

const { dbName, mongoUrl } = configs;

class Database {
  public client: MongoClient;

  constructor(public dbName: string, public url: string) {
    this.client = {} as MongoClient;
  }

  async connect() {
    log.info("Database connecting...");
    const client: MongoClient = new MongoClient();
    await client.connect(this.url);
    this.client = client;
    log.info("Database connected!");
  }

  get getDatabase() {
    return this.client.database(this.dbName);
  }
}

const db = new Database(dbName, mongoUrl);
await db.connect();

export default db;
