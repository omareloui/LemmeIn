import { Test } from "../../helpers/test.helper.ts";
import { assertEquals } from "../../deps.ts";
import { normalizeDocument } from "../normalizeDocuments.ts";

const testHelper = new Test("utils/normalizeDocuments:");

testHelper.test("should replace _id with id for a single document", () => {
  const document = { _id: "222", name: "John Doe" };
  const normalized = normalizeDocument(document);
  assertEquals(normalized.id, document._id);
  // @ts-expect-error on _id because it should be undefined
  assertEquals(normalized._id, undefined);
});
