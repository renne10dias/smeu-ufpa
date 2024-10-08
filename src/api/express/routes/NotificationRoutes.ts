import { ApiExpress } from "../ApiExpress";
import { NotificationController } from "../controllers/NotificationController";
import { AuthMiddleware } from "../../../middlewares/AuthMiddleware";
import { UserRoleEnum } from '../../../enums/UserRoleEnum';

export class NotificationRoutes {
    public static registerRoutes(api: ApiExpress) {
        // Apenas usuários com a role 'admin' podem criar notificações
        api.addPostRoute("/notifications", NotificationController, 'create', AuthMiddleware.authenticateRoles([UserRoleEnum.ADMIN]));
        
        // Qualquer usuário autenticado (admin, funcionario, user) pode visualizar notificações
        api.addGetRoute("/notifications/:id", NotificationController, 'find', AuthMiddleware.authenticateRoles(['admin', 'funcionario', 'user']));
        
        // Apenas 'admin' ou 'funcionario' podem atualizar notificações
        api.addPutRoute("/notifications/:id", NotificationController, 'update', AuthMiddleware.authenticateRoles(['admin', 'funcionario']));
        
        // Apenas 'admin' pode deletar notificações
        api.addDeleteRoute("/notifications/:id", NotificationController, 'delete', AuthMiddleware.authenticateRoles(['admin']));
    }
}
