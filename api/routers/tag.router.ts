import TagController from "../controllers/tag.controller.ts";
import { Router } from "../deps.ts";

import { validate } from "../middlewares/validate.middleware.ts";
import {
  createTagValidation,
  getTagsValidation,
  getTagValidation,
  deleteTagValidation,
  updateTagValidation,
} from "../validations/tag.validation.ts";

const router: Router = new Router();

router
  .get("/tags", validate(getTagsValidation), TagController.viewAll)
  .post("/tags", validate(createTagValidation), TagController.create)
  .get("/tags/:id", validate(getTagValidation), TagController.viewOne)
  .put("/tags/:id", validate(updateTagValidation), TagController.update)
  .delete("/tags/:id", validate(deleteTagValidation), TagController.delete);

export default router;
