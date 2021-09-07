import { Test } from "../../helpers/test.helper.ts";
import { assertEquals } from "../../deps.ts";
import sleep from "../sleep.ts";

const testHelper = new Test("utils/sleep:");

testHelper.test("should sleep 1 second", async () => {
  const delay = 1;
  const currentDate = new Date();
  await sleep(delay);
  const dateAfter = new Date();
  assertEquals(
    Math.floor((Number(dateAfter) - Number(currentDate)) / 1000),
    delay
  );
});
