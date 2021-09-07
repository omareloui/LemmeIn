import { Test } from "../../helpers/test.helper.ts";
import { assertEquals } from "../../deps.ts";
import convertHexToUnit8Array from "../convertHexToUnit8Array.ts";

const testHelper = new Test("utils/convertHexToUnit8Array:");

testHelper.testError(
  "should throw error on providing invalid hex with wrong hex values",
  () => convertHexToUnit8Array("22ss45ff"),
  "not valid hex"
);

testHelper.testError(
  "should throw error on providing invalid hex with odd number length",
  () => convertHexToUnit8Array("111"),
  "not valid hex"
);

testHelper.test("should convert from hex to unit 8 array correctly", () => {
  const unit8 = convertHexToUnit8Array("123456abcdef");
  assertEquals(unit8, new Uint8Array([18, 52, 86, 171, 205, 239]));
});
