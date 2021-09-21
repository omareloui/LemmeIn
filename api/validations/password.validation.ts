import { yup } from "../deps.ts";
import { requiredId } from "../utils/checkIfMongoId.ts";

const createAndUpdatePasswordBody = {
  app: yup.string().min(3).max(256).trim().required(`Field "app" is required`),
  password: yup
    .string()
    .min(3)
    .max(256)
    .trim()
    .required(`Field "password" is required`),
  accountIdentifier: yup.string().trim(),
  note: yup.string().trim(),
  site: yup.string().url().trim(),
  tags: yup.array().of(yup.string()),
  isOAuth: yup.boolean(),
};

export const createPasswordValidation = {
  body: yup.object(createAndUpdatePasswordBody),
};

export const getPasswordValidation = {
  params: yup.object({ id: requiredId }),
};

export const getPasswordsValidation = {};

export const decryptPasswordValidation = {
  params: yup.object({ id: requiredId }),
};

export const updatePasswordValidation = {
  params: yup.object({ id: requiredId }),
  body: yup.object(createAndUpdatePasswordBody),
};

export const deletePasswordValidation = {
  params: yup.object({
    id: requiredId,
  }),
};
