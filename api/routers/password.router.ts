import { Router } from "../deps.ts";
import PasswordController from "../controllers/password.controller.ts";

import { validate } from "../middlewares/validate.middleware.ts";
import {
  getPasswordsValidation,
  getPasswordValidation,
  createPasswordValidation,
  deletePasswordValidation,
} from "../validations/password.validation.ts";

const router = new Router();

router
  .get("/passwords", validate(getPasswordsValidation), PasswordController.viewAll)
  .post("/passwords", validate(createPasswordValidation), PasswordController.create)
  .get("/passwords/:id", validate(getPasswordValidation), PasswordController.viewOne)
  .delete("/passwords/:id", validate(deletePasswordValidation), PasswordController.delete);

export default router;
