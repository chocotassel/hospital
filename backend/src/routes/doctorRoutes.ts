import Router from 'koa-router';
import doctorController from '../controllers/DoctorController';
import koaBody from 'koa-body';

const router = new Router();

router.get('/doctors', doctorController.getDoctors);
router.get('/doctor/:id', doctorController.getDoctorById);
// router.get('/doctor', doctorController.getDoctor);
router.post('/doctors', doctorController.createDoctor);
router.put('/doctors/:id', doctorController.updateDoctor);
router.delete('/doctors/:id', doctorController.deleteDoctor);

export default router;