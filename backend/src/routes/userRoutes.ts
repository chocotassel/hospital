import Router from 'koa-router';
import userController from '../controllers/UserController';

const router = new Router();

router.post('/users', userController.createUser);
router.put('/users/:id/role', userController.changeRole);
router.delete('/users/:id', userController.deleteUser);

export default router;
