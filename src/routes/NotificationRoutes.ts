import { Router } from 'express';
import { NotificationController } from '../controllers/notification/NotificationController';

const router = Router();
const notificationController = NotificationController.build(); // Chama o método build diretamente

// Definindo as rotas para notificações, utilizando diretamente os métodos
router.post('/notifications', notificationController.create.bind(notificationController));
router.get('/notifications/:id', notificationController.find.bind(notificationController));
router.put('/notifications/:id', notificationController.update.bind(notificationController));

export default router;
