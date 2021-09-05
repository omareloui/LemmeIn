import { assertEquals, assertThrows } from "../../deps.ts";
import convertHexToUnit8Array from "../convertHexToUnit8Array.ts";

Deno.test({
  name: "utils/convertHexToUnit8Array: should accept only valid hex",
  fn() {
    assertThrows(
      () => convertHexToUnit8Array("22ss45ff"),
      Error,
      "not valid hex"
    );
    assertThrows(() => convertHexToUnit8Array("111"), Error, "not valid hex");
  },
});

Deno.test({
  name:
    "utils/convertHexToUnit8Array: should convert from hex to unit 8 array correctly",
  fn() {
    const unit8 = convertHexToUnit8Array("123456abcdef");
    assertEquals(unit8, new Uint8Array([18, 52, 86, 171, 205, 239]));
  },
});
