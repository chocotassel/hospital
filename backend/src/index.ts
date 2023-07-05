// 入口文件
require('dotenv').config();

import https from 'https';
import fs from 'fs';
import path from 'path';
import Koa from 'koa';
import serve from 'koa-static';
import koaBody from 'koa-body';
// import bodyParser from 'koa-bodyparser';
import mount from 'koa-mount';

import loginRoutes from './routes/loginRoutes';
import departmentRoutes from './routes/departmentRoutes';
import officeRoutes from './routes/officeRoutes';
import doctorRoutes from './routes/doctorRoutes';
import visitRoutes from './routes/visitRoutes';
import userRoutes from './routes/userRoutes';
import permissionRoutes from './routes/permissionRoutes';

import errorHandlingMiddleware from './common/middlewares/errorHandlingMiddleware';
import accessControlMiddleware from './common/middlewares/accessControlMiddleware';

import db from './db';

db();

const app = new Koa();
// const api = new Koa();

// 挂载前端应用
app.use(serve(path.join(__dirname, '..', '..', 'frontend', 'dist')));

// 访问控制中间件
app.use(koaBody());
app.use(errorHandlingMiddleware);
app.use(accessControlMiddleware);


// 路由
app.use(loginRoutes.routes());
app.use(departmentRoutes.routes());
app.use(officeRoutes.routes());
app.use(doctorRoutes.routes());
app.use(visitRoutes.routes());
app.use(userRoutes.routes());
app.use(permissionRoutes.routes());


export default app;

// // 统一接口前缀
// app.use(mount('/api', api));

// app.listen(3000, () => {
//   console.log('Server is running on localhost:3000');
// });

// app.use(router.routes()).use(router.allowedMethods());

// const options = {
//   key: fs.readFileSync(path.resolve(__dirname, '../key.pem')),
//   cert: fs.readFileSync(path.resolve(__dirname, '../cert.pem')),
// };

// const server = https.createServer(options, app.callback())
// server.listen(443);
// console.log('Server is running on https://localhost:443');

// export default server;