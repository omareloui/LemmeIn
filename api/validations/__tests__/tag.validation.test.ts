import { ValidationTest, ValidData } from "./validate.test.helper.ts";
import type { ErrorValidationDataForCreationAndUpdate } from "./validate.test.helper.ts";

import {
  createTagValidation,
  deleteTagValidation,
  getTagsValidation,
  updateTagValidation,
} from "../tag.validation.ts";

const tagTest = new ValidationTest("tag");

const errorValidationData: ErrorValidationDataForCreationAndUpdate[] = [
  {
    description: "should have tag as required",
    body: { color: "#333" },
    errorIncludes: "Field tag is required",
  },
  {
    description: "should have color as required",
    body: { tag: "validTag" },
    errorIncludes: "Field color is required",
  },
  {
    description: "should not accept spaces in tags",
    body: { tag: "invalid tag", color: "#333" },
    errorIncludes: "can't have spaces",
  },
  {
    description: "should not accept special characters in tags",
    body: { tag: "invalid-tag", color: "#333" },
    errorIncludes: "can't have spaces or special character",
  },
];

const passingValidations: ValidData[] = [
  {
    description: "should need nothing on getting tags",
    schema: getTagsValidation,
  },
  {
    description: "should take id on deleting a tag",
    schema: deleteTagValidation,
    params: {
      id: "ea22f9203c4ea22fa21123c4",
    },
  },
];

tagTest.validateCreateAndUpdateErrors(
  errorValidationData,
  createTagValidation,
  updateTagValidation
);
tagTest.testValidData(passingValidations);
