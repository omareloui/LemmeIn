import TagController from "../controllers/tag.controller.ts";
import { Router } from "../deps.ts";
import { auth } from "../middlewares/auth.middleware.ts";
import { validate } from "../middlewares/validate.middleware.ts";
import {
  createTagValidation,
  deleteTagValidation,
  getTagsValidation,
  getTagValidation,
  updateTagValidation,
} from "../validations/tag.validation.ts";

const router: Router = new Router();

router.get(
  "/tags",
  validate(getTagsValidation),
  auth("manageMyTags"),
  TagController.viewAll
);

router.post(
  "/tags",
  validate(createTagValidation),
  auth("manageMyTags"),
  TagController.create
);

router.get(
  "/tags/:id",
  validate(getTagValidation),
  auth("manageMyTags"),
  TagController.viewOne
);

router.put(
  "/tags/:id",
  validate(updateTagValidation),
  auth("manageMyTags"),
  TagController.update
);

router.delete(
  "/tags/:id",
  validate(deleteTagValidation),
  auth("manageMyTags"),
  TagController.delete
);

export default router;
