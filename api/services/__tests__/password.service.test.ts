import { ServiceTest } from "./service.test.helper.ts";
import PasswordService from "../password.service.ts";

import { assertEquals } from "../../deps.ts";

const serviceTest = new ServiceTest("password", PasswordService);

const passwordToTestOn = "134.a2!4~234";

serviceTest.testCreateRecord({ app: "google.com", password: passwordToTestOn });
serviceTest.testGetOneMine();
serviceTest.testGetAllMine();

serviceTest.test("should decrypt password correctly", async () => {
  const password = await PasswordService.decrypt(
    serviceTest.createdRecordId!,
    serviceTest.userId
  );
  assertEquals(password, passwordToTestOn);
});

serviceTest.testRemovingOneMine();

// // TODO: test oath passwords
// // TODO: test tags and make sure to be populated
