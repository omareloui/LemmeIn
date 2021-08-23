import AuthController from "../controllers/auth.controller.ts";
import { Router } from "../deps.ts";
import { validate } from "../middlewares/validate.middleware.ts";
import {
  loginValidation,
  registerValidation,
  meValidation,
} from "../validations/auth.validation.ts";
import { auth } from "../middlewares/auth.middleware.ts";

const router: Router = new Router();

router.post("/auth/login", validate(loginValidation), AuthController.login);

router.post(
  "/auth/register",
  validate(registerValidation),
  AuthController.register
);

router.get("/me", auth("getMe"), validate(meValidation), AuthController.me);

export default router;
