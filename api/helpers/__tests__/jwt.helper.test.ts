import { assertEquals } from "../../deps.ts";
import sleep from "../../utils/sleep.ts";

import JwtHelper from "../jwt.helper.ts";

const NAME_PREFIX = "helpers/jwt:";

Deno.test({
  name: `${NAME_PREFIX} should create a token`,
  async fn() {
    const token = await JwtHelper.create(100, "2a2fec4798");
    assertEquals(token.split(".").length, 3);
  },
});

Deno.test({
  name: `${NAME_PREFIX} should verifying a token and return true`,
  async fn() {
    const token = await JwtHelper.create(100);
    const validationResult = await JwtHelper.verify(token);
    assertEquals(validationResult, true);
  },
});

Deno.test({
  name: `${NAME_PREFIX} should return false on verifying invalid token`,
  async fn() {
    const token = await JwtHelper.create(100);
    const invalidatedToken = token.replace(/a/g, "b");
    const validationResult = await JwtHelper.verify(invalidatedToken);
    assertEquals(validationResult, false);
  },
});

Deno.test({
  name: `${NAME_PREFIX} should return false on verifying after the expiration date is exceeded`,
  async fn() {
    const token = await JwtHelper.create(1);
    const validationResultBefore = await JwtHelper.verify(token);
    assertEquals(validationResultBefore, true);
    await sleep(3);
    const validationResultAfter = await JwtHelper.verify(token);
    assertEquals(validationResultAfter, false);
  },
});

Deno.test({
  name: `${NAME_PREFIX} should get the payload as it was`,
  async fn() {
    const userId = "1e201324ffc09ac";
    const token = await JwtHelper.create(10, userId);
    const tokenPayload = await JwtHelper.getPayload(token);
    assertEquals(tokenPayload.id, userId);
  },
});
