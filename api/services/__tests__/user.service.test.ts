import { UserHistory } from "../../models/user_history.model.ts";
import UserService from "../user.service.ts";
import { ServiceTest } from "./service.test.helper.ts";
import { assertEquals } from "../../deps.ts";

const serviceTest = new ServiceTest("user", UserService);
const serviceDuplicatedEmailTest = new ServiceTest("user", UserService);

serviceTest.testCreate({
  firstName: "omar",
  lastName: "eloui",
  email: "omareloui@hotmail.com",
  password: "12345678",
});

serviceDuplicatedEmailTest.testAsyncError(
  "should not create a user with an already used email",
  async () => {
    await UserService.create({
      email: "omareloui@hotmail.com",
      firstName: "none",
      lastName: "anything",
      password: "12345",
    });
  },
  "email is already in use"
);

serviceTest.testGetOne();
serviceTest.testGetAll();

serviceTest.testUpdateOne({ lastName: "elwy" });
serviceTest.testUpdateOne({ firstName: "kenzy" });

serviceTest.testRemovingOne();

serviceTest.test(
  "should have 4 history for the documents for the current user after updating twice and deleting him/her",
  async () => {
    const userHistory = await UserService.getUserHistory(
      serviceTest.createdRecordId!
    );
    assertEquals(userHistory.length, 4);
    await UserHistory.drop();
  }
);
