import { yup } from "../deps.ts";
import { requiredId } from "../utils/checkIfMongoId.ts";

const createAndUpdateAccountBody = {
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

export const createAccountValidation = {
  body: yup.object(createAndUpdateAccountBody),
};

export const getAccountValidation = {
  params: yup.object({ id: requiredId }),
};

export const getAccountsValidation = {};

export const decryptAccountValidation = {
  params: yup.object({ id: requiredId }),
};

export const updateAccountValidation = {
  params: yup.object({ id: requiredId }),
  body: yup.object(createAndUpdateAccountBody),
};

export const deleteAccountValidation = {
  params: yup.object({
    id: requiredId,
  }),
};