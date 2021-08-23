import AuthController from "../controllers/auth.controller.ts";
import { Router } from "../deps.ts";
import { validate } from "../middlewares/validate.middleware.ts";
import {
  loginValidation,
  registerValidation,
} from "../validations/auth.validation.ts";

const router: Router = new Router();

router.post("/auth/login", validate(loginValidation), AuthController.login);
router.post(
  "/auth/register",
  validate(registerValidation),
  AuthController.register
);

export default router;
