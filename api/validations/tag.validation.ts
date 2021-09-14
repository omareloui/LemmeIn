import { yup } from "../deps.ts";
import { requiredId } from "../utils/checkIfMongoId.ts";

const createAndUpdateValidationBody = {
  tag: yup
    .string()
    .min(1)
    .max(16)
    .matches(
      /^[^\s.,<>`~+*!@#$%^&()[\]'"\/\\?:;-]+$/,
      "You can't have spaces or special character in the tag name."
    )
    .trim()
    .required("Field tag is required"),
  color: yup
    .string()
    .min(4)
    .max(28)
    // .matches(
    //   /^(#[\da-fA-F]{3,8}|hsla?\(\d{1,3}, \d{1,3}%, \d{1,3}%(, \d{1,3}%)?\))$/,
    //   "Field color must be hex color or hsl color"
    // )
    .trim()
    .required("Field color is required"),
};

export const createTagValidation = {
  body: yup.object(createAndUpdateValidationBody),
};

export const getTagsValidation = {};

export const updateTagValidation = {
  params: yup.object({ id: requiredId }),
  body: yup.object(createAndUpdateValidationBody),
};

export const deleteTagValidation = {
  params: yup.object({ id: requiredId }),
};
