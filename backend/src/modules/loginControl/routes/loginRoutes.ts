import Router from 'koa-router';
import LoginController from '../controllers/loginController';

const router = new Router();

router.post('/login', LoginController.login);
router.get('/login', LoginController.index);


export default router;