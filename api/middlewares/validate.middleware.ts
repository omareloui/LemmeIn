// deno-lint-ignore-file

import { helpers, RouterContext } from "../deps.ts";
import ErrorHelper from "../helpers/error.helper.ts";
const validateErrorHelper = new ErrorHelper("validate");

const checkInvalidParams = (fields: any, payload: any): void => {
  const allowedParams = Object.keys(fields);
  const requestParams = Object.keys(payload);
  for (const param of requestParams) {
    if (allowedParams.indexOf(param) < 0) {
      return validateErrorHelper.badRequest({
        param,
        message: `${param} is not allowed`,
        name: "ValidationError",
      });
    }
  }
};

const checkValidation = async (
  schema: {
    fields: any;
    validate: (
      arg0: unknown,
      arg1: { stripUnknown: boolean; abortEarly: boolean }
    ) => any;
  },
  payload: any
): Promise<void> => {
  checkInvalidParams(schema.fields, payload);
  try {
    await schema.validate(payload, { stripUnknown: true, abortEarly: true });
  } catch (validationErrors) {
    throw { ...validationErrors };
  }
};

export const validate = (schema: any) => async (
  ctx: RouterContext,
  next: () => void
): Promise<void> => {
  const { params: _params, queries: _query, body: _body } = schema;
  const allQueries = [
    {
      type: "body",
      _data: await ctx.request.body().value,
      _schema: _body,
    },
    {
      type: "param",
      _data: ctx.params,
      _schema: _params,
    },
    {
      type: "query",
      _data: helpers.getQuery(ctx),
      _schema: _query,
    },
  ];

  for (const _q of allQueries) {
    if (_q._schema?.fields && _q._data) {
      await checkValidation(_q._schema, _q._data);
    } else if (
      _q._data &&
      Object.keys(_q._data).length &&
      (!_q._schema || (_q._schema && !_q._schema.has("fields")))
    ) {
      return validateErrorHelper.badRequest({
        name: "ValidationError",
        message: `${_q.type} is not allowed`,
        param: _q.type,
      });
    }
  }
  await next();
};