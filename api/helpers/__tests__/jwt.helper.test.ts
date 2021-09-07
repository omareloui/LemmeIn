import { Test } from "../test.helper.ts";
import { assertEquals } from "../../deps.ts";
import sleep from "../../utils/sleep.ts";

import JwtHelper from "../jwt.helper.ts";

const testHelper = new Test("helpers/jwt:");

testHelper.test("should create a token", async () => {
  const token = await JwtHelper.create(100, { id: "2a2fec4798" });
  assertEquals(token.split(".").length, 3);
});

testHelper.test("should verifying a token and return true", async () => {
  const token = await JwtHelper.create(100);
  const validationResult = await JwtHelper.verify(token);
  assertEquals(validationResult, true);
});

testHelper.test("should return false on verifying invalid token", async () => {
  const token = await JwtHelper.create(100);
  const invalidatedToken = token.replace(/a/g, "b");
  const validationResult = await JwtHelper.verify(invalidatedToken);
  assertEquals(validationResult, false);
});

testHelper.test(
  "should return false on verifying after the expiration date is exceeded",
  async () => {
    const token = await JwtHelper.create(1);
    const validationResultBefore = await JwtHelper.verify(token);
    assertEquals(validationResultBefore, true);
    await sleep(3);
    const validationResultAfter = await JwtHelper.verify(token);
    assertEquals(validationResultAfter, false);
  }
);

testHelper.test("should get the payload as it was", async () => {
  const userId = "1e201324ffc09ac";
  const token = await JwtHelper.create(10, { id: userId });
  const tokenPayload = await JwtHelper.getPayload(token);
  assertEquals(tokenPayload.id, userId);
});
