import { assertEquals } from "../../deps.ts";
import capitalize from "../capitalize.ts";

Deno.test({
  name: "utils/capitalize: should work",
  fn() {
    const string = "hello, world!";
    const capitalizedString = capitalize(string);
    assertEquals(capitalizedString, "Hello, World!");
  },
});
