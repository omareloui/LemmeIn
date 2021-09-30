import { Router } from "../deps.ts";
import PasswordController from "../controllers/password.controller.ts";
import { auth } from "../middlewares/auth.middleware.ts";
import { validate } from "../middlewares/validate.middleware.ts";
import {
  createPasswordValidation,
  deletePasswordValidation,
  getPasswordsValidation,
  getPasswordValidation,
  updatePasswordValidation,
  decryptPasswordValidation,
} from "../validations/password.validation.ts";

const router = new Router();

router.get(
  "/passwords",
  validate(getPasswordsValidation),
  auth("manageMyPasswords"),
  PasswordController.viewAllMine
);

router.post(
  "/passwords",
  validate(createPasswordValidation),
  auth("manageMyPasswords"),
  PasswordController.create
);

router.get(
  "/passwords/decrypt/:id",
  validate(decryptPasswordValidation),
  auth("manageMyPasswords"),
  PasswordController.decrypt
);

router.get(
  "/passwords/:id",
  validate(getPasswordValidation),
  auth("manageMyPasswords"),
  PasswordController.viewOneMine
);

router.put(
  "/passwords/:id",
  validate(updatePasswordValidation),
  auth("manageMyPasswords"),
  PasswordController.updateOneMine
);

router.delete(
  "/passwords/:id",
  validate(deletePasswordValidation),
  auth("manageMyPasswords"),
  PasswordController.deleteMine
);

export default router;
