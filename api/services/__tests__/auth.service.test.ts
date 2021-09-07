import { assertEquals } from "../../deps.ts";
import AuthService from "../auth.service.ts";
import { ServiceTest } from "./service.test.helper.ts";
import generateRandomText from "../../utils/generateRandomText.ts";

const serviceTest = new ServiceTest("auth", AuthService);

const randomText = generateRandomText(8);
const logData = {
  email: `${randomText}@hotmail.com`,
  password: "12345678",
};

serviceTest.test("should register user fine and get a token", async () => {
  const { token, user } = await AuthService.register({
    firstName: "omar",
    lastName: "eloui",
    ...logData,
  });
  assertEquals(Object.hasOwn(token, "token"), true);
  assertEquals(Object.hasOwn(user, "id"), true);
});

serviceTest.test("should login the user fine and get a token", async () => {
  const { token, user } = await AuthService.login(logData);
  assertEquals(Object.hasOwn(token, "token"), true);
  assertEquals(Object.hasOwn(user, "id"), true);
});

serviceTest.testAsyncError(
  "should throw error if provided email that doesn't exist",
  async () => {
    await AuthService.login({
      email: `${generateRandomText(9)}@gmail.com`,
      password: "13245678",
    });
  },
  "email or password is not correct"
);

serviceTest.testAsyncError(
  "should throw error if provided invalid password",
  async () => {
    await AuthService.login({
      email: logData.email,
      password: "no_valid_pass",
    });
  },
  "email or password is not correct"
);
