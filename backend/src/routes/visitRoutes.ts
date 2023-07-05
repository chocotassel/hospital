// visitRoutes.ts
import Router from 'koa-router';
import visitController from '../controllers/VisitController';

const router = new Router({
  prefix: '/api'  // 添加 '/api' 前缀
});

router.get('/visits', visitController.getVisits);
router.get('/visit/:id', visitController.getVisit);
router.post('/visits', visitController.createVisit);
router.put('/visits/:id', visitController.updateVisit);
router.delete('/visits/:id', visitController.deleteVisit);

export default router;
