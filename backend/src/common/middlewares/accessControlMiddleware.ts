import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { accessLogger } from '../logger';

const unauthenticatedPaths = [
  '/',
  '/api/login',
  '/api/test'
]

const adminPaths = [
  '/admin'
];

const doctorPaths = [
  '/info'
];

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
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = decoded;
    console.log(decoded.role)
    
    // 路径权限检查
    if (adminPaths.includes(ctx.path) && decoded.role !== 'admin') {
      ctx.throw(403, '无权限');
    }

    if (doctorPaths.includes(ctx.path) && decoded.role !== 'doctor') {
      ctx.throw(403, '无权限');
    }

    await next();
  } catch (err) {
    ctx.throw(401, '权限校验失败');
  }

  accessLogger.info(`${ctx.method} ${ctx.url} ${ctx.status} ${ctx.response.message} ${ctx.response.length}`);
}
