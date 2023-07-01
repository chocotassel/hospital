import Router from 'koa-router';
import DoctorController from '../controllers/doctorController';

const router = new Router();

router.get('/self', DoctorController.getDepartments);
router.put('/self', DoctorController.getOffices);
router.put('/self', DoctorController.getVisits);
router.put('/self', DoctorController.getDoctorInfo);
router.put('/self', DoctorController.updateDoctorInfo);

export default router;
