import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';

export default async function authMiddleware(ctx: Context, next: Next) {

  if (!process.env.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET environment variable');
  }
  require('dotenv').config();
  const JWT_SECRET = process.env.JWT_SECRET;
      
  const token = ctx.headers.authorization;

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
}
