import { Router } from "../deps.ts";
import { PasswordSchema } from "../models/Password.ts";
import PasswordController from "../controllers/passwords.controller.ts";

const passwordController = new PasswordController();

const router = new Router();

router
  .get("/", async ({ response }) => {
    const passwords = await passwordController.viewAll();
    response.body = passwords;
  })
  .get("/:id", async ({ response, params }) => {
    const passwords = await passwordController.viewById(params.id);
    response.body = passwords;
  })
  .post("/", async ({ request, response }) => {
    const ok = await passwordController.create(await request.body().value);
    response.body = ok;
  })
  .delete("/:id", async ({ response, params }) => {
    const ok = await passwordController.delete(params.id);
    response.body = ok;
  })
  .put("/:id", async ({ params, request, response }) => {
    if (!params.id) throw new Error("No id provided");
    const ok = await passwordController.update(
      params.id,
      (await request.body().value) as Partial<PasswordSchema>
    );
    response.body = ok;
  });

export default router;
