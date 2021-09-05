import { assertEquals } from "../../deps.ts";
import generateRandomText from "../generateRandomText.ts";

Deno.test({
  name: "utils/generateRandomText: should generate text with provided length",
  fn() {
    const length = 50;
    const text = generateRandomText(length);
    assertEquals(text.length, length);
  },
});
