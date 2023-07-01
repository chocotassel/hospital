// validate.ts
import { Context } from "koa";
import Schema, { Rules, RuleType, Values } from "async-validator";

async function validate<T extends Values>(ctx: Context, rules: Rules): Promise<{data: T, error: any}> {
  const validator = new Schema(rules);
  const data = ctx.request.body as T;

  return await validator.validate(data).then(() => {
    return { data, error: null }
  }).catch(({ errors, fields }) => {
    return { data: {} as T, error: errors }
  })
}

export default validate