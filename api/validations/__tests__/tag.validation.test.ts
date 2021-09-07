import { ValidationTest, ValidData } from "./validate.test.helper.ts";
import type { ErrorValidationData } from "./validate.test.helper.ts";

import {
  createTagValidation,
  deleteTagValidation,
  getTagsValidation,
  updateTagValidation,
} from "../tag.validation.ts";

const tagTest = new ValidationTest("tag");

const errorValidationData: ErrorValidationData[] = [
  {
    description: "should have tag as required",
    values: { color: "#333" },
    errorIncludes: "Field tag is required",
  },
  {
    description: "should have color as required",
    values: { tag: "validTag" },
    errorIncludes: "Field color is required",
  },
  {
    description: "should not accept spaces in tags",
    values: { tag: "invalid tag", color: "#333" },
    errorIncludes: "can't have spaces",
  },
  {
    description: "should not accept special characters in tags",
    values: { tag: "invalid-tag", color: "#333" },
    errorIncludes: "can't have spaces or special character",
  },
  {
    description: "should accept only hsl and hex colors",
    values: { tag: "validTag", color: "rgb(11, 11, 11)" },
    errorIncludes: "must be hex color or hsl color",
  },
];

tagTest.validateCreateAndUpdateErrors(
  errorValidationData,
  createTagValidation,
  updateTagValidation
);

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

tagTest.testValidData(passingValidations);
