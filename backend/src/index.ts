import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import adminRoutes from './modules/accessControl/routes/adminRoutes';
import doctorRoutes from './modules/accessControl/routes/doctorRoutes';
import errorHandlingMiddleware from './common/middlewares/errorHandlingMiddleware';
import accessControlMiddleware from './common/middlewares/accessControlMiddleware';

require('dotenv').config();

const app = new Koa();

app.use(bodyParser());
app.use(errorHandlingMiddleware);
app.use(accessControlMiddleware);  // 记得在路由之前添加访问控制中间件
app.use(adminRoutes.routes());
app.use(doctorRoutes.routes());

app.listen(3000, () => {
  console.log('Server is running on localhost:3000');
});

export default app;
