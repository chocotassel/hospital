import Router from 'koa-router';
import DepartmentController from '../controllers/DepartmentController';

const router = new Router();

router.post('/login', DepartmentController.getDepartments);
router.get('/login', DepartmentController.createDepartment);
router.get('/login', DepartmentController.updateDepartment);
router.get('/login', DepartmentController.deleteDepartment);


export default router;