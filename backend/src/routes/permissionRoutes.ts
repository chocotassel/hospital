import Router from 'koa-router';
import PermissionController from '../controllers/PermissionController';

const router = new Router({
  prefix: '/api'  // 添加 '/api' 前缀
});

router.get('/permission/roles', PermissionController.getRoles);
router.get('/permission/permissions', PermissionController.getPermissions);

export default router;