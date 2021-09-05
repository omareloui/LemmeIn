import { assertEquals } from "../../deps.ts";
import convertUnit8ArrayToHex from "../convertUnit8ArrayToHex.ts";

Deno.test({
  name:
    "utils/convertUnit8ArrayToHex: should convert from unit 8 array to hex correctly",
  fn() {
    const hex = convertUnit8ArrayToHex(
      new Uint8Array([18, 52, 86, 171, 205, 239])
    );
    assertEquals(hex, "123456abcdef");
  },
});
