import { Test } from "../../helpers/test.helper.ts";
import { assertEquals } from "../../deps.ts";
import capitalize from "../capitalize.ts";

const testHelper = new Test("utils/capitalize");

testHelper.test("should work", () => {
  const string = "hello, world!";
  const capitalizedString = capitalize(string);
  assertEquals(capitalizedString, "Hello, World!");
});
