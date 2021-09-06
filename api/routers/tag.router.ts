import TagController from "../controllers/tag.controller.ts";
import { Router } from "../deps.ts";
import { auth } from "../middlewares/auth.middleware.ts";
import { validate } from "../middlewares/validate.middleware.ts";
import {
  createTagValidation,
  deleteTagValidation,
  getTagsValidation,
  updateTagValidation,
} from "../validations/tag.validation.ts";

const router: Router = new Router();

router.get(
  "/tags",
  validate(getTagsValidation),
  auth("manageMyTags"),
  TagController.viewAllMine
);

router.post(
  "/tags",
  validate(createTagValidation),
  auth("manageMyTags"),
  TagController.create
);

router.put(
  "/tags/:id",
  validate(updateTagValidation),
  auth("manageMyTags"),
  TagController.updateMine
);

router.delete(
  "/tags/:id",
  validate(deleteTagValidation),
  auth("manageMyTags"),
  TagController.deleteMine
);

export default router;
