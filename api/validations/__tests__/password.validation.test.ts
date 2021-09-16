import { ValidationTester } from "./validate.test.helper.ts";
import type {
  ValidData,
  ErrorValidationDataForCreationAndUpdate,
} from "./validate.test.helper.ts";

import {
  getPasswordValidation,
  getPasswordsValidation,
  createPasswordValidation,
  updatePasswordValidation,
  deletePasswordValidation,
} from "../password.validation.ts";

const validationTester = new ValidationTester("password");

const errorValidationData: ErrorValidationDataForCreationAndUpdate[] = [
  {
    description:
      "should have 'app' as required on creating and updating password",
    body: { password: "valid pass" },
    errorIncludes: '"app" is required',
  },
  {
    description:
      "should have 'password' as required on creating and updating password",
    body: { app: "google.com" },
    errorIncludes: '"password" is required',
  },
  {
    description:
      "should throw error on password less than 3 characters on creating and updating password",
    body: { app: "some app", password: "no" },
    errorIncludes: "at least 3 characters",
  },
  {
    description:
      "should throw error on providing extra field on creating and updating password",
    body: { app: "some app", password: "validPass", notValidField: false },
    errorIncludes: "notValidField is not allowed",
  },
];

const passingValidations: ValidData[] = [
  {
    description:
      "should pass on providing only app and password on creating password",
    schema: createPasswordValidation,
    body: {
      app: "google.com",
      password: "SomePassword",
    },
  },
  {
    description: "should accept accountIdentifier",
    schema: createPasswordValidation,
    body: {
      app: "google.com",
      password: "SomePassword",
      accountIdentifier: "omarelwy@gmail.com",
    },
  },
  {
    description: "should accept note",
    schema: createPasswordValidation,
    body: {
      app: "google.com",
      password: "SomePassword",
      note: "some note",
    },
  },
  {
    description: "should accept site",
    schema: createPasswordValidation,
    body: {
      app: "google.com",
      password: "SomePassword",
      site: "https://google.com",
    },
  },
  {
    description: "should take id on requesting a password",
    schema: getPasswordValidation,
    params: {
      id: "ea22f9203c4ea22fa21123c4",
    },
  },
  {
    description: "should take nothing on requesting all passwords",
    schema: getPasswordsValidation,
  },
  {
    description: "should take id for deleting password",
    schema: deletePasswordValidation,
    params: {
      id: "ea22f9203c4ea22fa21123c4",
    },
  },
];

validationTester.validateCreateAndUpdateErrors(
  errorValidationData,
  createPasswordValidation,
  updatePasswordValidation
);
validationTester.testValidData(passingValidations);
