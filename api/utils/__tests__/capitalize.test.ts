import { Tester } from "../../helpers/test.helper.ts";
import capitalize from "../capitalize.ts";

const tester = new Tester("utils/capitalize");

tester.test("should work", () => {
  const string = "hello, world!";
  const capitalizedString = capitalize(string);
  tester.shouldEquals(capitalizedString, "Hello, World!");
});
