import { assertEquals, assertThrowsAsync } from "../../deps.ts";
import { yup } from "../../deps.ts";
import { requiredId } from "../checkIfMongoId.ts";

const NAME_PREFIX = "utils/checkIfMongoId:";

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
              res(yup.object({ id: requiredId }).validate({ id }));
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
  name: `${NAME_PREFIX} should not throw error if valid mongo id provided`,
  async fn() {
    const validId = "ab3ca12572b0a3ca91c2f7c2";
    await yup
      .object({
        id: requiredId,
      })
      .validate({ id: validId });

    assertEquals(true, true);
  },
});

interface ErrorValidationData {
  name: string;
  password: string;
  errorIncludes: string;
}

const errorValidationData: ErrorValidationData[] = [
  {
    name: "should throw error if string shorter than 24 characters is provided",
    password: "ab3ca91c2f7c2",
    errorIncludes: "must be exactly 24",
  },
  {
    name: "should throw error if string larger than 24 characters is provided",
    password: "aab3ca91c2f7c2ab3ca91c2f7c2ab3ca91c2f7c2ab3ca91c2f7c7c2",
    errorIncludes: "must be exactly 24",
  },
  {
    name: "should throw error if not hex code",
    password: "ax3ca12572b0a3ca91c2f7c2",
    errorIncludes: "has to be valid id",
  },
];

errorValidationData.forEach((x) =>
  Deno.test(
    assertErrorMessage(`${NAME_PREFIX} ${x.name}`, x.password, x.errorIncludes)
  )
);
