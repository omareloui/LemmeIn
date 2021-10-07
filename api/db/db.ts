import { MongoClient } from "../deps.ts";

import { config } from "../config/index.ts";
import { log } from "../utils/index.ts";

const { dbName, mongoUrl } = config;

class Database {
  public client: MongoClient;

  constructor(public dbName: string, public url: string) {
    this.client = {} as MongoClient;
  }

  async connect() {
    try {
      log.info("Database connecting...");
      const client: MongoClient = new MongoClient();
      await client.connect(this.url);
      this.client = client;
      log.info("Database connected!");
    } catch (e) {
      log.critical(e.message);
      Deno.exit(1);
    }
  }

  get getDatabase() {
    return this.client.database(this.dbName);
  }
}

const db = new Database(dbName, mongoUrl);
await db.connect();

export default db;
