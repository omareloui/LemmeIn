import { Router } from "../deps.ts";
import AccountController from "../controllers/account.controller.ts";
import { auth } from "../middlewares/auth.middleware.ts";
import { validate } from "../middlewares/validate.middleware.ts";
import {
  createAccountValidation,
  deleteAccountValidation,
  getAccountsValidation,
  getAccountValidation,
  updateAccountValidation,
  decryptAccountValidation,
} from "../validations/account.validation.ts";

const router = new Router();

router.get(
  "/accounts",
  validate(getAccountsValidation),
  auth("manageMyAccounts"),
  AccountController.viewAllMine
);

router.post(
  "/accounts",
  validate(createAccountValidation),
  auth("manageMyAccounts"),
  AccountController.create
);

router.get(
  "/accounts/decrypt/:id",
  validate(decryptAccountValidation),
  auth("manageMyAccounts"),
  AccountController.decrypt
);

router.get(
  "/accounts/:id",
  validate(getAccountValidation),
  auth("manageMyAccounts"),
  AccountController.viewOneMine
);

router.put(
  "/accounts/:id",
  validate(updateAccountValidation),
  auth("manageMyAccounts"),
  AccountController.updateOneMine
);

router.delete(
  "/accounts/:id",
  validate(deleteAccountValidation),
  auth("manageMyAccounts"),
  AccountController.deleteMine
);

export default router;
