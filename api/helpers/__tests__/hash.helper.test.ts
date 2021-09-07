import { Test } from "../test.helper.ts";
import { assertEquals } from "../../deps.ts";
import HashHelper from "../hash.helper.ts";

const testHelper = new Test("helpers/hash:");

const textToHash = "someTextToHash";

testHelper.test("should hash and compare with true result", async () => {
  const hash = await HashHelper.hash(textToHash);
  const compareResult = await HashHelper.compare(textToHash, hash);
  assertEquals(compareResult, true);
});
