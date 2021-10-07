import AnalyzeAccountsController from "../controllers/analyze-accounts.controller.ts";

import { Router } from "../deps.ts";
import { auth } from "../middlewares/auth.middleware.ts";
import { validate } from "../middlewares/validate.middleware.ts";

import { analyzeMine } from "../validations/analyze-accounts.validation.ts";

const router: Router = new Router();

router.get(
  "/analyze",
  validate(analyzeMine),
  auth("manageMyAccounts"),
  AnalyzeAccountsController.analyzeMine
);

export default router;
