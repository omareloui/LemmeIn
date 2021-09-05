import { assertEquals, assertMatch } from "../../deps.ts";
import PasswordService from "../password.service.ts";

const NAME_PREFIX = "services/password:";

const USER_ID = "testing_user_id";
const PASSWORD = "134.a2!4~234";

let currentPasswordId: string;

Deno.test({
  name: `${NAME_PREFIX} should create password`,
  async fn() {
    const passwordId = await PasswordService.createPassword(
      { app: "google.com", password: PASSWORD },
      USER_ID
    );
    const passwordIdString = passwordId.toString();
    currentPasswordId = passwordIdString;
    assertMatch(passwordIdString, /^[\da-f]{24}$/);
  },
});

Deno.test({
  name: `${NAME_PREFIX} should decrypt password correctly`,
  async fn() {
    const password = await PasswordService.decrypt(currentPasswordId, USER_ID);
    assertEquals(password, PASSWORD);
  },
});

Deno.test({
  name: `${NAME_PREFIX} should delete created password`,
  async fn() {
    const deletionCount = await PasswordService.removeMyPassword(
      currentPasswordId,
      USER_ID
    );
    assertEquals(deletionCount, 1);
  },
});

// TODO: test oath passwords
// TODO: test tags and make sure to be populated
