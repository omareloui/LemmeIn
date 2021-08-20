import { Router } from "../deps.ts";
import { TagSchema } from "../models/Tag.ts";
import TagController from "../controllers/tags.controller.ts";

const tagController = new TagController();

const router = new Router();

router
  .get("/", async ({ response }) => {
    const tags = await tagController.viewAll();
    response.body = tags;
  })
  .get("/:id", async ({ response, params }) => {
    const tags = await tagController.viewById(params.id);
    response.body = tags;
  })
  .post("/", async ({ request, response }) => {
    const ok = await tagController.create(await request.body().value);
    response.body = ok;
  })
  .delete("/:id", async ({ response, params }) => {
    const ok = await tagController.delete(params.id);
    response.body = ok;
  })
  .put("/:id", async ({ params, request, response }) => {
    if (!params.id) throw new Error("No id provided");
    const ok = await tagController.update(
      params.id,
      (await request.body().value) as Partial<TagSchema>
    );
    response.body = ok;
  });

export default router;
