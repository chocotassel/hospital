import Router from 'koa-router';
import LoginController from '../controllers/AuthenticationController';

const router = new Router({
  prefix: '/api'  // 添加 '/api' 前缀
});

router.post('/login', LoginController.login);
router.get('/login', LoginController.index);


export default router;