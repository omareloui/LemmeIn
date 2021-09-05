import { assertThrowsAsync, RouteParams } from "../../deps.ts";
import validateHelper from "./validate.test.helper.ts";
import {
  getPasswordValidation,
  getPasswordsValidation,
  createPasswordValidation,
  updatePasswordValidation,
  deletePasswordValidation,
} from "../password.validation.ts";

const NAME_PREFIX = "validations/password:";

function assertErrorMessage(
  name: string,
  schema: Record<string, unknown>,
  body: Record<string, unknown>,
  errorMessageIncludes: string,
  params?: RouteParams
) {
  return {
    name,
    fn() {
      assertThrowsAsync(
        () => {
          return new Promise((res, rej) => {
            try {
              res(validateHelper(schema, body, params));
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

interface ErrorValidationData {
  name: string;
  values: Record<string, unknown>;
  errorIncludes: string;
}

const errorValidationData: ErrorValidationData[] = [
  {
    name: "should have 'app' as required on creating and updating password",
    values: { password: "valid pass" },
    errorIncludes: "'app' is required",
  },
  {
    name:
      "should throw error on password less than 3 characters on creating and updating password",
    values: { app: "some app", password: "no" },
    errorIncludes: "at least 3 characters",
  },
  {
    name:
      "should throw error on providing extra field on creating and updating password",
    values: { app: "some app", password: "validPass", notValidField: false },
    errorIncludes: "notValidField is not allowed",
  },
];

errorValidationData.forEach((data) =>
  [createPasswordValidation, updatePasswordValidation].forEach(
    (schema, schemaIndex) => {
      const isCreating = schemaIndex === 0;
      Deno.test(
        assertErrorMessage(
          `${NAME_PREFIX} (${isCreating ? "create" : "update"}) ${data.name}`,
          schema,
          data.values,
          data.errorIncludes,
          !isCreating ? { id: "123456789abcdef123456789" } : undefined
        )
      );
    }
  )
);

Deno.test({
  name: `${NAME_PREFIX} should pass on providing only app and password on creating password`,
  async fn() {
    await validateHelper(createPasswordValidation, {
      app: "google.com",
      password: "SomePassword",
    });
  },
});

Deno.test({
  name: `${NAME_PREFIX} should accept accountIdentifier`,
  async fn() {
    await validateHelper(createPasswordValidation, {
      app: "google.com",
      password: "SomePassword",
      accountIdentifier: "omarelwy@gmail.com",
    });
  },
});

Deno.test({
  name: `${NAME_PREFIX} should accept note`,
  async fn() {
    await validateHelper(createPasswordValidation, {
      app: "google.com",
      password: "SomePassword",
      note: "some note",
    });
  },
});

Deno.test({
  name: `${NAME_PREFIX} should accept site`,
  async fn() {
    await validateHelper(createPasswordValidation, {
      app: "google.com",
      password: "SomePassword",
      site: "https://google.com",
    });
  },
});

Deno.test({
  name: `${NAME_PREFIX} should accept oAthPassword with valid mongo id`,
  async fn() {
    await validateHelper(createPasswordValidation, {
      app: "google.com",
      password: "SomePassword",
      oAuthPassword: "ea22f9203c4ea22fa21123c4",
    });
  },
});

Deno.test({
  name: `${NAME_PREFIX} should take id on requesting a password`,
  async fn() {
    await validateHelper(getPasswordValidation, undefined, {
      id: "ea22f9203c4ea22fa21123c4",
    });
  },
});

Deno.test({
  name: `${NAME_PREFIX} should take nothing on requesting all passwords`,
  async fn() {
    await validateHelper(getPasswordsValidation);
  },
});

Deno.test({
  name: `${NAME_PREFIX} should take id for deleting password`,
  async fn() {
    await validateHelper(deletePasswordValidation, undefined, {
      id: "ea22f9203c4ea22fa21123c4",
    });
  },
});
