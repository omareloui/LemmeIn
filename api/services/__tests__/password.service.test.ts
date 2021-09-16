import { ServiceTester } from "./service.test.helper.ts";
import PasswordService from "../password.service.ts";
import TagService from "../tag.service.ts";

import { mongoIdRegExp } from "../../utils/mongoIdRegExp.ts";

const serviceTester = new ServiceTester("password", PasswordService);
const oAuthServiceTest = new ServiceTester("password", PasswordService);

const passwordToTestOn = "134.a2!4~234";

const tag = await TagService.createMine(
  { tag: "testingWithPassword", color: "#333" },
  serviceTester.userId
);
const tagId = tag.id;

serviceTester.testCreateMine({
  app: "google.com",
  password: passwordToTestOn,
  tags: [tagId],
});

serviceTester.testGetOneMine();
serviceTester.testGetAllMine();

serviceTester.test("should decrypt password correctly", async () => {
  const password = await PasswordService.decrypt(
    serviceTester.createdRecordId!,
    serviceTester.userId
  );
  serviceTester.shouldEquals(password, passwordToTestOn);
});

serviceTester.test("should get password and populate the tags", async () => {
  const password = await PasswordService.getOneMine(
    serviceTester.createdRecordId!,
    serviceTester.userId
  );
  serviceTester.shouldEquals(password!.tags![0].tag, "testingWithPassword");
  await TagService.removeOneMine(tagId, serviceTester.userId);
});

oAuthServiceTest.test(
  "should create password with no encryption if it's oAuthed and populate it when getting it",
  async () => {
    if (!serviceTester.createdRecordId)
      throw new Error("No record created yet for the oAuth");
    const newPassword = await PasswordService.createMine(
      {
        app: "oAuthed app",
        password: serviceTester.createdRecordId,
        isOAuth: true,
      },
      oAuthServiceTest.userId
    );
    const newPasswordId = newPassword.id.toString();
    const password = await PasswordService.getOneMine(
      newPasswordId,
      oAuthServiceTest.userId
    );
    if (!password || !password.password)
      throw new Error("Got no password for oAuth");
    // @ts-ignore ignore that the password could  be as string
    serviceTester.shouldMatch(password.password.id, mongoIdRegExp);
    await PasswordService.removeOneMine(newPasswordId, oAuthServiceTest.userId);
  }
);

serviceTester.testRemovingOneMine();
