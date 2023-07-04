import Router from 'koa-router';
import doctorController from '../controllers/DoctorController';
import koaBody from 'koa-body';

const router = new Router();

router.get('/doctors', doctorController.getDoctors);
router.get('/doctor/:id', doctorController.getDoctor);
router.post('/doctors', doctorController.createDoctor);
router.put('/doctors/:id', koaBody({multipart: true}), doctorController.updateDoctor);
router.delete('/doctors/:id', doctorController.deleteDoctor);

export default router;