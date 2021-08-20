import { MongoClient } from "../deps.ts";
import { MONGO_DB_URI, DB_NAME } from "./main.ts";

const client = new MongoClient();
await client.connect(MONGO_DB_URI);
const db = client.database(DB_NAME);

export default db;
