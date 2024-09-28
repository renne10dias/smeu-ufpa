// NotificationRoutes.ts
import { ApiExpress } from "../ApiExpress";
import { NotificationController } from "../controllers/NotificationController";

export class NotificationRoutes {
    public static registerRoutes(api: ApiExpress) {
        api.addPostRoute("/notifications", NotificationController, 'create');
        api.addGetRoute("/notifications/:id", NotificationController, 'find');
        api.addPutRoute("/notifications/:id", NotificationController, 'update');
        api.addDeleteRoute("/notifications/:id", NotificationController, 'delete');
    }
}

// Instancia a classe e registra as rotas automaticamente
NotificationRoutes.registerRoutes(ApiExpress.getInstance());
