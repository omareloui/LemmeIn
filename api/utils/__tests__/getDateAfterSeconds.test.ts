import { Test } from "../../helpers/test.helper.ts";
import { assertEquals } from "../../deps.ts";
import getDateAfterSeconds from "../getDateAfterSeconds.ts";

const testHelper = new Test("utils/getDateAfterSeconds:");

testHelper.test("should get the correct date after 100 seconds", () => {
  const currentDate = new Date();
  const dateToUpdate = new Date();
  const secsDelay = 100;
  const dateAfter100Secs = getDateAfterSeconds(secsDelay, dateToUpdate);

  assertEquals(
    Number(dateAfter100Secs) - Number(currentDate),
    secsDelay * 1000
  );
});
