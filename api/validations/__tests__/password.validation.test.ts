import { ValidationTest } from "./validate.test.helper.ts";
import type { ValidData, ErrorValidationData } from "./validate.test.helper.ts";

import {
  getPasswordValidation,
  getPasswordsValidation,
  createPasswordValidation,
  updatePasswordValidation,
  deletePasswordValidation,
} from "../password.validation.ts";

const passwordTest = new ValidationTest("password");

const errorValidationData: ErrorValidationData[] = [
  {
    name: "should have 'app' as required on creating and updating password",
    values: { password: "valid pass" },
    errorIncludes: '"app" is required',
  },
  {
    name:
      "should have 'password' as required on creating and updating password",
    values: { app: "google.com" },
    errorIncludes: '"password" is required',
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

passwordTest.validateCreateAndUpdateErrors(
  errorValidationData,
  createPasswordValidation,
  updatePasswordValidation
);

const passingValidations: ValidData[] = [
  {
    name: "should pass on providing only app and password on creating password",
    schema: createPasswordValidation,
    body: {
      app: "google.com",
      password: "SomePassword",
    },
  },
  {
    name: "should accept accountIdentifier",
    schema: createPasswordValidation,
    body: {
      app: "google.com",
      password: "SomePassword",
      accountIdentifier: "omarelwy@gmail.com",
    },
  },
  {
    name: "should accept note",
    schema: createPasswordValidation,
    body: {
      app: "google.com",
      password: "SomePassword",
      note: "some note",
    },
  },
  {
    name: "should accept site",
    schema: createPasswordValidation,
    body: {
      app: "google.com",
      password: "SomePassword",
      site: "https://google.com",
    },
  },
  {
    name: "should take id on requesting a password",
    schema: getPasswordValidation,
    params: {
      id: "ea22f9203c4ea22fa21123c4",
    },
  },
  {
    name: "should take nothing on requesting all passwords",
    schema: getPasswordsValidation,
  },
  {
    name: "should take id for deleting password",
    schema: deletePasswordValidation,
    params: {
      id: "ea22f9203c4ea22fa21123c4",
    },
  },
];

passwordTest.testValidData(passingValidations);
