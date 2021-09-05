import { assertEquals } from "../../deps.ts";
import sleep from "../sleep.ts";

Deno.test({
  name: "utils/sleep: should sleep 1 second",
  async fn() {
    const delay = 1;
    const currentDate = new Date();
    await sleep(delay);
    const dateAfter = new Date();
    assertEquals(
      Math.floor((Number(dateAfter) - Number(currentDate)) / 1000),
      delay
    );
  },
});
