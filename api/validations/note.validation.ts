import { yup } from "../deps.ts";
import { requiredId } from "../utils/checkIfMongoId.ts";

const createAndUpdateValidationBody = {
  body: yup.string().trim().required(`Field "body" is required`),
  tags: yup.array().of(yup.string()),
};

export const createNoteValidation = {
  body: yup.object(createAndUpdateValidationBody),
};

export const getNotesValidation = {};

export const updateNoteValidation = {
  params: yup.object({ id: requiredId }),
  body: yup.object(createAndUpdateValidationBody),
};

export const deleteNoteValidation = {
  params: yup.object({ id: requiredId }),
};
