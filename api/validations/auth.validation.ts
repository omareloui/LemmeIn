import { yup } from "../deps.ts";

export const loginValidation = {
  body: yup.object({
    email: yup.string().email().trim().required(`email is required`),
    password: yup.string().required(`password is required`).max(255),
  }),
};

export const registerValidation = {
  body: yup.object({
    email: yup.string().email().trim().required(`email is required`),
    username: yup
      .string()
      .min(3)
      .max(255)
      .trim()
      .required(`username is required`),
    password: yup.string().min(8).max(255).required(`password is required`),
  }),
};
