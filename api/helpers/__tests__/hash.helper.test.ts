import { assertEquals } from "../../deps.ts";
import HashHelper from "../hash.helper.ts";

const NAME_PREFIX = "helpers/hash:";

const textToHash = "someTextToHash";

Deno.test({
  name: `${NAME_PREFIX} should hash and compare with true result`,
  async fn() {
    const hash = await HashHelper.hash(textToHash);
    const compareResult = await HashHelper.compare(textToHash, hash);
    assertEquals(compareResult, true);
  },
});
