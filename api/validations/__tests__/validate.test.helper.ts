import { RouterContext, testing, RouteParams } from "../../deps.ts";
import { validate } from "../../middlewares/validate.middleware.ts";

export default async function validateHelper(
  schema: Record<string, unknown>,
  body?: Record<string, unknown>,
  params?: RouteParams
) {
  // @ts-ignore don't need to check for the value's type
  const mockContext = {
    ...testing.createMockContext({ path: "/validate", params: params }),
    request: { body: () => ({ value: body }) },
  } as RouterContext;
  const mockNext = testing.createMockNext();

  try {
    await validate(schema)(mockContext, mockNext);
  } catch (e) {
    throw new Error(e.message);
  }
}
