import AuthController from "../controllers/auth.controller.ts";
import { Router } from "../deps.ts";
import { validate } from "../middlewares/validate.middleware.ts";
import {
  loginValidation,
  refreshTokenValidation,
  registerValidation,
} from "../validations/auth.validation.ts";

const router: Router = new Router();

router.post("/auth/login", validate(loginValidation), AuthController.login);
router.post(
  "/auth/register",
  validate(registerValidation),
  AuthController.register,
);

router.post(
  "/auth/refresh-tokens",
  validate(refreshTokenValidation),
  AuthController.refreshTokens,
);

export default router;
