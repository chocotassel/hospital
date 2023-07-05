import Router from 'koa-router';
import DepartmentController from '../controllers/DepartmentController';

const router = new Router();

router.get('/departments', DepartmentController.getDepartments);
router.get('/department/:id', DepartmentController.getDepartmentById);
// router.get('/department', DepartmentController.getDepartment);
router.post('/departments', DepartmentController.createDepartment);
router.put('/departments/:id', DepartmentController.updateDepartment);
router.delete('/departments/:id', DepartmentController.deleteDepartment);

export default router;