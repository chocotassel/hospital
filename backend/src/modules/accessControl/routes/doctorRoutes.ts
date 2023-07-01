import Router from 'koa-router';
import { DoctorController } from '../controllers/doctorController';

const router = new Router();

router.get('/self', DoctorController.viewSelf);
router.put('/self', DoctorController.modifySelf);
// 同理，添加其他的路由

export default router;
