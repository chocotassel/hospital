import Router from 'koa-router';
import AdminController from '../controllers/adminController';

const router = new Router();

router.get('/department', AdminController.getDepartments);
router.put('/department', AdminController.createDepartment);
router.put('/department', AdminController.updateDepartment);
router.put('/department', AdminController.deleteDepartment);

export default router;
