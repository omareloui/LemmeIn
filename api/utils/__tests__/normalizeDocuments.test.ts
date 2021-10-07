import { Tester } from "../../helpers/index.ts";
import { normalizeDocument } from "../index.ts";

const tester = new Tester("utils/normalizeDocuments:");

tester.test("should replace _id with id for a single document", () => {
  const document = { _id: "222", name: "John Doe" };
  const normalized = normalizeDocument(document);
  tester.shouldEquals(normalized!.id, document._id);
  // @ts-expect-error on _id because it should be undefined
  tester.shouldEquals(normalized._id, undefined);
});
