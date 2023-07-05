import Router from 'koa-router';
import doctorController from '../controllers/DoctorController';

const router = new Router({
  prefix: '/api'  // 添加 '/api' 前缀
});

router.get('/doctors', doctorController.getDoctors);
router.get('/doctor/:id', doctorController.getDoctorById);
router.get('/doctor', doctorController.getDoctorByEmployeeNumber);
// router.get('/doctor', doctorController.getDoctor);
router.post('/doctors', doctorController.createDoctor);
router.post('/doctors/upload/:id', doctorController.updateAvatar);
router.put('/doctors/:id', doctorController.updateDoctor);
router.delete('/doctors/:id', doctorController.deleteDoctor);

export default router;