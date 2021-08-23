import { Router } from "../deps.ts";
import PasswordController from "../controllers/password.controller.ts";
import { auth } from "../middlewares/auth.middleware.ts";
import { validate } from "../middlewares/validate.middleware.ts";
import {
  createPasswordValidation,
  deletePasswordValidation,
  getPasswordsValidation,
  getPasswordValidation,
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
  "/passwords/:id",
  validate(getPasswordValidation),
  auth("manageMyPasswords"),
  PasswordController.viewOneMine
);

router.delete(
  "/passwords/:id",
  validate(deletePasswordValidation),
  auth("manageMyPasswords"),
  PasswordController.deleteMine
);

export default router;
