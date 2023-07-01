import Router from 'koa-router';
import { AdminController } from '../controllers/adminController';

const router = new Router();

router.get('/department', AdminController.viewDepartment);
router.put('/department', AdminController.modifyDepartment);
// 同理，添加其他的路由

export default router;
