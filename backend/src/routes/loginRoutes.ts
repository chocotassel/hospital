import Router from 'koa-router';
import LoginController from '../controllers/AuthenticationController';

const router = new Router();

router.post('/login', LoginController.login);
router.get('/login', LoginController.index);


export default router;