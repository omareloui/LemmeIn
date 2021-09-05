import { assertEquals, assertThrowsAsync } from "../../deps.ts";
import { yup } from "../../deps.ts";
import checkIfMongoId from "../checkIfMongoId.ts";

function assertErrorMessage(
  name: string,
  id: string,
  errorMessageIncludes: string
) {
  return {
    name,
    fn() {
      assertThrowsAsync(
        () => {
          return new Promise((res, rej) => {
            try {
              res(yup.object({ id: checkIfMongoId }).validate({ id }));
            } catch (e) {
              rej(e.message);
            }
          });
        },
        Error,
        errorMessageIncludes
      );
    },
  };
}

Deno.test({
  name:
    "utils/checkIfMongoId: should not throw error if valid mongo id provided",
  async fn() {
    const validId = "ab3ca12572b0a3ca91c2f7c2";
    await yup
      .object({
        id: checkIfMongoId,
      })
      .validate({ id: validId });

    assertEquals(true, true);
  },
});

Deno.test(
  assertErrorMessage(
    "utils/checkIfMongoId: should throw error if string shorter than 24 characters is provided",
    "ab3ca91c2f7c2",
    "must be exactly 24"
  )
);

Deno.test(
  assertErrorMessage(
    "utils/checkIfMongoId: should throw error if string larger than 24 characters is provided",
    "aab3ca91c2f7c2ab3ca91c2f7c2ab3ca91c2f7c2ab3ca91c2f7c7c2",
    "must be exactly 24"
  )
);

Deno.test(
  assertErrorMessage(
    "utils/checkIfMongoId: should throw error if not hex code",
    "ax3ca12572b0a3ca91c2f7c2",
    "has to be valid id"
  )
);
