import { assertEquals } from "../../deps.ts";
import { normalizeDocument } from "../normalizeDocuments.ts";

Deno.test({
  name:
    "utils/normalizeDocuments should replace _id with id for a single document",
  fn() {
    const document = { _id: "222", name: "John Doe" };
    const normalized = normalizeDocument(document);
    assertEquals(normalized.id, document._id);
    // @ts-expect-error on _id because it should be undefined
    assertEquals(normalized._id, undefined);
  },
});
