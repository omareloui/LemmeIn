import { assertEquals } from "../../deps.ts";
import getDateAfterSeconds from "../getDateAfterSeconds.ts";

Deno.test({
  name:
    "utils/getDateAfterSeconds: should get the correct date after 100 seconds",
  fn() {
    const currentDate = new Date();
    const dateToUpdate = new Date();
    const secsDelay = 100;
    const dateAfter100Secs = getDateAfterSeconds(secsDelay, dateToUpdate);

    assertEquals(
      Number(dateAfter100Secs) - Number(currentDate),
      secsDelay * 1000
    );
  },
});
