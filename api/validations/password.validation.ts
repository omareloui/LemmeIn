import { yup } from "../deps.ts";
import checkIfMongoId from "../utils/checkIfMongoId.ts";

export const createPasswordValidation = {
  body: yup.object({
    password: yup.string().min(3).max(256).trim().required(`Password is required`),
    title: yup.string().min(3).min(3).max(256).trim().required(`Title is required`),
    emailOrUsername: yup.string().min(3).min(3).max(256).trim(),
    note: yup.string().min(3).min(3).max(256).trim(),
    site: yup.string().min(3).min(3).max(256).trim(),
    oAuthParty: yup.string().min(3).min(3).max(256).trim(),
    icon: yup.string().min(3).min(3).max(256).trim(),
    tags: yup.array().of(yup.string()),
  }),
};

export const getPasswordValidation = {
  params: yup.object({
    id: checkIfMongoId,
  }),
};

export const getPasswordsValidation = {};

export const updatePasswordValidation = {
  params: yup.object({
    id: checkIfMongoId,
  }),
  body: yup.object({
    password: yup.string().min(3).max(256).trim(),
    title: yup.string().min(3).min(3).max(256).trim(),
    emailOrUsername: yup.string().min(3).min(3).max(256).trim(),
    note: yup.string().min(3).min(3).max(256).trim(),
    site: yup.string().min(3).min(3).max(256).trim(),
    oAuthParty: yup.string().min(3).min(3).max(256).trim(),
    icon: yup.string().min(3).min(3).max(256).trim(),
    tags: yup.array().of(yup.string()),
  }),
};

export const deletePasswordValidation = {
  params: yup.object({
    id: checkIfMongoId,
  }),
};
