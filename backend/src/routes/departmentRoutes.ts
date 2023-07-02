import Router from 'koa-router';
import DepartmentController from '../controllers/DepartmentController';

const router = new Router();

router.post('/departments', DepartmentController.getDepartments);
router.get('/departments', DepartmentController.createDepartment);
router.get('/departments/:id', DepartmentController.updateDepartment);
router.get('/departments/:id', DepartmentController.deleteDepartment);


export default router;