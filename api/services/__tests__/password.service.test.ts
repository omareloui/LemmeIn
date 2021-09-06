import { ServiceTest } from "./service.test.helper.ts";
import PasswordService from "../password.service.ts";
import TagService from "../tag.service.ts";

import { assertEquals, assertMatch } from "../../deps.ts";
import { mongoIdRegExp } from "../../utils/mongoIdRegExp.ts";

const serviceTest = new ServiceTest("password", PasswordService);
const oAuthServiceTest = new ServiceTest("password", PasswordService);

const passwordToTestOn = "134.a2!4~234";

const tagId = await TagService.createForMe(
  { tag: "testingWithPassword", color: "#333" },
  serviceTest.userId
);

serviceTest.testCreateForMe({
  app: "google.com",
  password: passwordToTestOn,
  tags: [tagId],
});

serviceTest.testGetOneMine();
serviceTest.testGetAllMine();

serviceTest.test("should decrypt password correctly", async () => {
  const password = await PasswordService.decrypt(
    serviceTest.createdRecordId!,
    serviceTest.userId
  );
  assertEquals(password, passwordToTestOn);
});

serviceTest.test("should get password and populate the tags", async () => {
  const password = await PasswordService.getOneMine(
    serviceTest.createdRecordId!,
    serviceTest.userId
  );
  assertEquals(password!.tags![0].tag, "testingWithPassword");
  await TagService.removeOneMine(tagId, serviceTest.userId);
});

oAuthServiceTest.test(
  "should create password with no encryption if it's oAuthed and populate it when getting it",
  async () => {
    if (!serviceTest.createdRecordId)
      throw new Error("No record created yet for the oAuth");

    const newPasswordId = await PasswordService.createForMe(
      {
        app: "oAuthed app",
        password: serviceTest.createdRecordId,
        isOAuth: true,
      },
      oAuthServiceTest.userId
    );

    const password = await PasswordService.getOneMine(
      newPasswordId,
      oAuthServiceTest.userId
    );
    if (!password || !password.password)
      throw new Error("Got no password for oAuth");
    assertMatch(password.password.id, mongoIdRegExp);
    assertEquals(password.password.app, "google.com");
    await PasswordService.removeOneMine(newPasswordId, oAuthServiceTest.userId);
  }
);

serviceTest.testRemovingOneMine();
