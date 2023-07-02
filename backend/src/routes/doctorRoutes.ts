import Router from 'koa-router';
import doctorController from '../controllers/DoctorController';

const router = new Router();

router.get('/doctors', doctorController.getDoctors);
router.post('/doctors', doctorController.createDoctor);
router.put('/doctors/:id', doctorController.updateDoctor);
router.delete('/doctors/:id', doctorController.deleteDoctor);

export default router;