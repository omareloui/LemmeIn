import { yup } from "../deps.ts";

export default yup
  .string()
  .length(24)
  .matches(/^[\da-f]{24}$/i, "It has to be valid id")
  .required()
  .trim();
