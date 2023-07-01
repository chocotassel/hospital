import { Context, Next } from 'koa';

interface IError extends Error {
  status?: number;
}

export default async function errorHandlingMiddleware(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    let error = err as IError;
    ctx.status = error.status || 500;
    ctx.body = { message: error.message };
    ctx.app.emit('error', error, ctx);
  }
}
