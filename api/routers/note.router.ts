import NoteController from "../controllers/note.controller.ts";
import { Router } from "../deps.ts";
import { auth } from "../middlewares/auth.middleware.ts";
import { validate } from "../middlewares/validate.middleware.ts";
import {
  getNotesValidation,
  createNoteValidation,
  deleteNoteValidation,
  updateNoteValidation,
} from "../validations/note.validation.ts";

const router: Router = new Router();

router.get(
  "/notes",
  validate(getNotesValidation),
  auth("manageMyNotes"),
  NoteController.viewAllMine
);

router.post(
  "/notes",
  validate(createNoteValidation),
  auth("manageMyNotes"),
  NoteController.create
);

router.put(
  "/notes/:id",
  validate(updateNoteValidation),
  auth("manageMyNotes"),
  NoteController.updateMine
);

router.delete(
  "/notes/:id",
  validate(deleteNoteValidation),
  auth("manageMyNotes"),
  NoteController.deleteMine
);

export default router;
