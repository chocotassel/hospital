import Router from 'koa-router';
import PermissionController from '../controllers/PermissionController';

const router = new Router();

router.get('/permission/roles', PermissionController.getRoles);
router.get('/permission/permissions', PermissionController.getPermissions);

export default router;