// 入口文件
require('dotenv').config();

import https from 'https';
import fs from 'fs';
import path from 'path';
import Koa from 'koa';
import serve from 'koa-static';
import koaBody from 'koa-body';
import bodyParser from 'koa-bodyparser';
import mount from 'koa-mount';

import loginRoutes from './routes/loginRoutes';

import errorHandlingMiddleware from './common/middlewares/errorHandlingMiddleware';
import accessControlMiddleware from './common/middlewares/accessControlMiddleware';

import db from './db';

db();

const app = new Koa();
// const api = new Koa();

// 挂载前端应用
app.use(serve(path.join(__dirname, '..', '..', 'frontend', 'build')));

// 访问控制中间件
app.use(bodyParser());
app.use(errorHandlingMiddleware);
app.use(accessControlMiddleware);


// 路由
app.use(loginRoutes.routes());

// // 统一接口前缀
// app.use(mount('/api', api));

// app.listen(3000, () => {
//   console.log('Server is running on localhost:3000');
// });

// app.use(router.routes()).use(router.allowedMethods());

const options = {
  key: fs.readFileSync(path.resolve(__dirname, '../key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert.pem')),
};

https.createServer(options, app.callback()).listen(443);
console.log('Server is running on https://localhost:443');

export default app;