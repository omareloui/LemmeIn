import { ObjectId } from "../../deps.ts";
import { ServiceTester } from "./service.test.helper.ts";
import PasswordService from "../password.service.ts";
import TagService from "../tag.service.ts";
import { Password } from "../../models/password.model.ts";

import { mongoIdRegExp } from "../../utils/mongoIdRegExp.ts";
import generateRandomText from "../../utils/generateRandomText.ts";

const serviceTester = new ServiceTester("password", PasswordService);
const oAuthServiceTester = new ServiceTester("password", PasswordService);

const passwordToTestOn = "134.a2!4~234";

const tagName = generateRandomText(20);
const tag = await TagService.createMine(
  { tag: tagName, color: "#333" },
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
  serviceTester.shouldEquals(password!.tags![0].tag, tagName);
  await TagService.removeOneMine(tagId, serviceTester.userId);
});

oAuthServiceTester.test(
  "should create password with no encryption if it's oAuthed and populate it when getting it",
  async () => {
    if (!serviceTester.createdRecordId)
      throw new Error("No record created yet for the oAuth");
    const newPassword = await PasswordService.createMine(
      {
        app: "oAuthed app",
        password: serviceTester.createdRecordId.toString(),
        isOAuth: true,
      },
      oAuthServiceTester.userId
    );
    const newPasswordId = newPassword.id.toString();
    const password = await PasswordService.getOneMine(
      newPasswordId,
      oAuthServiceTester.userId
    );
    if (!password || !password.password)
      throw new Error("Got no password for oAuth");
    // @ts-ignore ignore that the password could  be as string
    serviceTester.shouldMatch(password.password.id, mongoIdRegExp);
    await PasswordService.removeOneMine(
      newPasswordId,
      oAuthServiceTester.userId
    );
  }
);

serviceTester.test("should updating the password's app", async () => {
  if (!serviceTester.createdRecordId)
    throw new Error("Didn't create the record yet");

  const newApp = "new app name";
  await PasswordService.updateOneMine(
    serviceTester.createdRecordId,
    { app: newApp },
    serviceTester.userId
  );

  const doc = await PasswordService.getOneMine(
    serviceTester.createdRecordId,
    serviceTester.userId
  );

  serviceTester.shouldEquals(doc.app, newApp);
});

serviceTester.test(
  "should update updatedAt date and should update site if provided",
  async () => {
    if (!serviceTester.createdRecordId)
      throw new Error("Didn't create the record yet");

    const recordToUpdate = await PasswordService.getOneMine(
      serviceTester.createdRecordId,
      serviceTester.userId
    );
    // The update the app with the same last app name so it shouldn't update it
    await PasswordService.updateOneMine(
      serviceTester.createdRecordId,
      { site: "https://newsite.com" },
      serviceTester.userId
    );
    // await serviceTester.testUpdateOneMine({ site: "https://brandnewsite.com" });
    const recordAfterUpdate = await PasswordService.getOneMine(
      serviceTester.createdRecordId,
      serviceTester.userId
    );
    serviceTester.shouldEquals(
      Number(recordToUpdate.updatedAt) < Number(recordAfterUpdate.updatedAt),
      true
    );
  }
);

serviceTester.test(
  "should not update updated at date if no data provided and shouldn't update app field if same value",
  async () => {
    if (!serviceTester.createdRecordId)
      throw new Error("Didn't create the record yet");

    const recordToUpdate = await PasswordService.getOneMine(
      serviceTester.createdRecordId,
      serviceTester.userId
    );
    // The update the app with the same last app name so it shouldn't update it
    await serviceTester.testUpdateOneMine({ app: "new app name" });
    const recordAfterUpdate = await PasswordService.getOneMine(
      serviceTester.createdRecordId,
      serviceTester.userId
    );
    serviceTester.shouldEquals(
      recordToUpdate.updatedAt,
      recordAfterUpdate.updatedAt
    );
  }
);

serviceTester.test(
  "should update and decrypt the password if provided with no oauth",
  async () => {
    if (!serviceTester.createdRecordId)
      throw new Error("Didn't create the record yet");

    const newPass = "new so random password";

    const id = serviceTester.createdRecordId;
    const userId = serviceTester.userId;

    const recordToUpdate = await Password.findOne({
      _id: new ObjectId(id),
      user: userId,
    });
    if (!recordToUpdate)
      throw new Error("Couldn't find the record before update");

    await PasswordService.updateOneMine(
      id,
      { password: newPass, isOAuth: false },
      userId
    );

    const recordAfterUpdate = await Password.findOne({
      _id: new ObjectId(id),
      user: userId,
    });

    if (!recordAfterUpdate)
      throw new Error("Couldn't find the record after update");

    serviceTester.shouldEquals(
      recordAfterUpdate.password !== newPass &&
        recordAfterUpdate.password !== recordToUpdate.password,
      true
    );
    serviceTester.shouldMatch(
      recordAfterUpdate.password,
      /[\da-f]{32}.[\da-f]/i
    );
  }
);

serviceTester.test(
  "should not update the password if provided as oauth with invalid id",
  async () => {
    if (!serviceTester.createdRecordId)
      throw new Error("Didn't create the record yet");

    const newPassId = "abf2f3d3a3aa";

    const id = serviceTester.createdRecordId;
    const userId = serviceTester.userId;

    const recordToUpdate = await Password.findOne({
      _id: new ObjectId(id),
      user: userId,
    });
    if (!recordToUpdate)
      throw new Error("Couldn't find the record before update");

    await PasswordService.updateOneMine(
      id,
      { password: newPassId, isOAuth: true },
      userId
    );

    const recordAfterUpdate = await Password.findOne({
      _id: new ObjectId(id),
      user: userId,
    });

    if (!recordAfterUpdate)
      throw new Error("Couldn't find the record after update");

    serviceTester.shouldEquals(
      recordAfterUpdate.password !== newPassId &&
        recordAfterUpdate.password === recordToUpdate.password,
      true
    );
  }
);

serviceTester.test(
  "should not update the password if it is an id for a password that is the current password id",
  async () => {
    if (!serviceTester.createdRecordId)
      throw new Error("Didn't create the record yet");

    const newPass = serviceTester.createdRecordId.toString();

    const id = serviceTester.createdRecordId;
    const userId = serviceTester.userId;

    const recordToUpdate = await Password.findOne({
      _id: new ObjectId(id),
      user: userId,
    });
    if (!recordToUpdate)
      throw new Error("Couldn't find the record before update");

    await PasswordService.updateOneMine(
      id,
      { password: newPass, isOAuth: true },
      userId
    );

    const recordAfterUpdate = await Password.findOne({
      _id: new ObjectId(id),
      user: userId,
    });

    if (!recordAfterUpdate)
      throw new Error("Couldn't find the record after update");

    serviceTester.shouldEquals(
      recordAfterUpdate.password !== newPass &&
        recordAfterUpdate.password === recordToUpdate.password,
      true
    );
  }
);

serviceTester.test(
  "should not update the password if it is an id for a password that points to the current one",
  async () => {
    if (!serviceTester.createdRecordId)
      throw new Error("Didn't create the record yet");

    // The oauth was created pointing to the current one
    const newPass = oAuthServiceTester.createdRecordId?.toString();

    const id = serviceTester.createdRecordId;
    const userId = serviceTester.userId;

    const recordToUpdate = await Password.findOne({
      _id: new ObjectId(id),
      user: userId,
    });
    if (!recordToUpdate)
      throw new Error("Couldn't find the record before update");

    await PasswordService.updateOneMine(
      id,
      { password: newPass, isOAuth: true },
      userId
    );

    const recordAfterUpdate = await Password.findOne({
      _id: new ObjectId(id),
      user: userId,
    });

    if (!recordAfterUpdate)
      throw new Error("Couldn't find the record after update");

    serviceTester.shouldEquals(
      recordAfterUpdate.password !== newPass &&
        recordAfterUpdate.password === recordToUpdate.password,
      true
    );
  }
);

serviceTester.test(
  "should not update the password if it is an id for a password that points to a password that points to the current one",
  async () => {
    if (!serviceTester.createdRecordId)
      throw new Error("Didn't create the record yet");

    const passPointingToCurrentId = (
      await Password.insertOne({
        app: "some app",
        password: serviceTester.createdRecordId.toString(),
        user: serviceTester.userId,
      })
    ).toString();
    const passPointingToTheOnePointingToCurrentId = (
      await Password.insertOne({
        app: "some app",
        password: passPointingToCurrentId,
        user: serviceTester.userId,
      })
    ).toString();

    const id = serviceTester.createdRecordId;
    const userId = serviceTester.userId;

    const recordToUpdate = await Password.findOne({
      _id: new ObjectId(id),
      user: userId,
    });
    if (!recordToUpdate)
      throw new Error("Couldn't find the record before update");

    await PasswordService.updateOneMine(
      id,
      { password: passPointingToTheOnePointingToCurrentId, isOAuth: true },
      userId
    );

    const recordAfterUpdate = await Password.findOne({
      _id: new ObjectId(id),
      user: userId,
    });

    if (!recordAfterUpdate)
      throw new Error("Couldn't find the record after update");

    serviceTester.shouldEquals(
      recordAfterUpdate.password !== passPointingToTheOnePointingToCurrentId &&
        recordAfterUpdate.password === recordToUpdate.password,
      true
    );

    await Password.deleteOne({ _id: new ObjectId(passPointingToCurrentId) });
    await Password.deleteOne({
      _id: new ObjectId(passPointingToTheOnePointingToCurrentId),
    });
  }
);

serviceTester.test(
  "should update the password if provided with oauth id",
  async () => {
    if (!serviceTester.createdRecordId)
      throw new Error("Didn't create the record yet");
    const id = serviceTester.createdRecordId.toString();
    const userId = serviceTester.userId;
    const createdId = (
      await Password.insertOne({
        app: "any new pass",
        password: "just_for_the_id",
        user: userId,
      })
    ).toString();
    const recordToUpdate = await Password.findOne({
      _id: new ObjectId(id),
      user: userId,
    });
    if (!recordToUpdate)
      throw new Error("Couldn't find the record before update");
    await PasswordService.updateOneMine(
      id,
      { password: createdId, isOAuth: true },
      userId
    );
    const recordAfterUpdate = await Password.findOne({
      _id: new ObjectId(id),
      user: userId,
    });
    if (!recordAfterUpdate)
      throw new Error("Couldn't find the record after update");
    serviceTester.shouldEquals(
      recordAfterUpdate.password === createdId &&
        recordAfterUpdate.password !== recordToUpdate.password,
      true
    );
    await Password.deleteOne({ _id: new ObjectId(createdId) });
  }
);

// TODO:
// serviceTester.test("should not update the password if it is an id for a password that points to the current one two or more levels in")

serviceTester.testRemovingOneMine();
