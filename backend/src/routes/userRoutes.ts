import Router from 'koa-router';
import userController from '../controllers/UserController';

const router = new Router({
  prefix: '/api'  // 添加 '/api' 前缀
});

router.get('/users', userController.getUsers);
router.get('/user/:id', userController.getUser);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

export default router;
