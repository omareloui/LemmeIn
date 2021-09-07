import { Test } from "../../helpers/test.helper.ts";
import { assertEquals } from "../../deps.ts";
import convertUnit8ArrayToHex from "../convertUnit8ArrayToHex.ts";

const testHelper = new Test("utils/convertUnit8ArrayToHex:");

testHelper.test("should convert from unit 8 array to hex correctly", () => {
  const hex = convertUnit8ArrayToHex(
    new Uint8Array([18, 52, 86, 171, 205, 239])
  );
  assertEquals(hex, "123456abcdef");
});
