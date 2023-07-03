// visitRoutes.ts
import Router from 'koa-router';
import visitController from '../controllers/VisitController';

const router = new Router();

router.get('/visits', visitController.getVisits);
router.get('/visits/:id', visitController.getVisit);
router.post('/visits', visitController.createVisit);
router.put('/visits/:id', visitController.updateVisit);
router.delete('/visits/:id', visitController.deleteVisit);

export default router;
