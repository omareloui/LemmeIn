import { yup } from "../deps.ts";
import checkIfMongoId from "../utils/checkIfMongoId.ts";

export const createTagValidation = {
  body: yup.object({
    tag: yup
      .string()
      .min(1)
      .max(256)
      .matches(
        /^[^\s.,<>`~+*!@#$%^&()[\]'"\/\\?:;-]+$/,
        "You can't have spaces or special character in the tag name."
      )
      .trim()
      .required(`Tag name is required`),
  }),
};

export const getTagValidation = {
  params: yup.object({
    id: checkIfMongoId,
  }),
};

export const getTagsValidation = {};

export const updateTagValidation = {
  params: yup.object({
    id: checkIfMongoId,
  }),
  body: yup.object({
    tag: yup.string().min(1).max(256).trim().required(`Tag name is required`),
  }),
};

export const deleteTagValidation = {
  params: yup.object({
    id: checkIfMongoId,
  }),
};
