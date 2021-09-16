import { Tester } from "../../helpers/test.helper.ts";
import generateRandomText from "../generateRandomText.ts";

const tester = new Tester("utils/generateRandomText:");

tester.test("should generate text with provided length", () => {
  const length = 50;
  const text = generateRandomText(length);
  tester.shouldEquals(text.length, length);
});
