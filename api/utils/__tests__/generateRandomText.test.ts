import { Test } from "../../helpers/test.helper.ts";
import { assertEquals } from "../../deps.ts";
import generateRandomText from "../generateRandomText.ts";

const testHelper = new Test("utils/generateRandomText:");
testHelper.test("should generate text with provided length", () => {
  const length = 50;
  const text = generateRandomText(length);
  assertEquals(text.length, length);
});
