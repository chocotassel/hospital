// officeRoutes.ts
import Router from 'koa-router';
import officeController from '../controllers/OfficeController';

const router = new Router();

router.get('/offices', officeController.getOffices);
router.get('/offices/:id', officeController.getOffice);
router.post('/offices', officeController.createOffice);
router.put('/offices/:id', officeController.updateOffice);
router.delete('/offices/:id', officeController.deleteOffice);

export default router;
