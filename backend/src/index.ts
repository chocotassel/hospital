import https from 'https';
import fs from 'fs';
import path from 'path';
import Koa from 'koa';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import adminRoutes from './modules/accessControl/routes/adminRoutes';
import doctorRoutes from './modules/accessControl/routes/doctorRoutes';
import errorHandlingMiddleware from './common/middlewares/errorHandlingMiddleware';
import accessControlMiddleware from './common/middlewares/accessControlMiddleware';

require('dotenv').config();

const app = new Koa();

// 挂载前端应用
// app.use(serve('../../frontend/build'));

app.use(bodyParser());
app.use(errorHandlingMiddleware);
app.use(accessControlMiddleware);  // 记得在路由之前添加访问控制中间件
app.use(adminRoutes.routes());
app.use(doctorRoutes.routes());

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

