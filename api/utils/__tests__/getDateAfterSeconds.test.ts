import { Tester } from "../../helpers/test.helper.ts";
import getDateAfterSeconds from "../getDateAfterSeconds.ts";

const tester = new Tester("utils/getDateAfterSeconds:");

tester.test("should get the correct date after 100 seconds", () => {
  const currentDate = new Date();
  const dateToUpdate = new Date();
  const secsDelay = 100;
  const dateAfter100Secs = getDateAfterSeconds(secsDelay, dateToUpdate);

  tester.shouldEquals(
    Number(dateAfter100Secs) - Number(currentDate),
    secsDelay * 1000
  );
});
