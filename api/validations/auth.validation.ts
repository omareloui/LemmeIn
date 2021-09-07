import { yup } from "../deps.ts";

export const loginValidation = {
  body: yup.object({
    email: yup.string().email().trim().required(`email is required`),
    password: yup.string().min(8).max(255).required(`password is required`),
  }),
};

export const registerValidation = {
  body: yup.object({
    email: yup.string().email().trim().required(`email is required`),
    firstName: yup
      .string()
      .min(3)
      .max(255)
      .trim()
      .matches(
        /^[^.,<>`~+*!@#$%^&()[\]'"\/\\?:;-]+$/,
        "You can't have special character in the first name field."
      )
      .required(`first name is required`),
    lastName: yup
      .string()
      .min(3)
      .max(255)
      .trim()
      .matches(
        /^[^.,<>`~+*!@#$%^&()[\]'"\/\\?:;-]+$/,
        "You can't have special character in the last name field."
      )
      .required(`last name is required`),
    password: yup.string().min(8).max(255).required(`password is required`),
  }),
};

export const meValidation = {};
