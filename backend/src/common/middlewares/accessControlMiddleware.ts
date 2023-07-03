import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { accessLogger } from '../logger';

const unauthenticatedPaths = [
  '/',
  '/login',
  '/test'
]

export default async function authMiddleware(ctx: Context, next: Next) {

  if (!process.env.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET environment variable');
  }

  // Skip authentication for the login route
  if (unauthenticatedPaths.includes(ctx.path)) {
    await next();
    return;
  }
      
  const token = ctx.headers.authorization?.split(' ')[1];

  if (!token) {
    ctx.throw(401, 'Authentication Error: No Token Provided');
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = decoded;
    await next();
  } catch (err) {
    ctx.throw(401, 'Authentication Error: Invalid Token');
  }

  accessLogger.info(`${ctx.method} ${ctx.url} ${ctx.status} ${ctx.response.message} ${ctx.response.length}`);
}
