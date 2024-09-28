// NotificationRoutes.ts
import { ApiExpress } from "../ApiExpress";
import { NotificationController } from "../controllers/NotificationController";

export class NotificationRoutes {
    private static api: ApiExpress = ApiExpress.getInstance();

    // Método estático para registrar rotas
    public static registerRoutes() {
        this.api.addPostRoute("/notifications", NotificationController, 'create');
        this.api.addGetRoute("/notifications/:id", NotificationController, 'find');
        this.api.addPutRoute("/notifications/:id", NotificationController, 'update');
        this.api.addDeleteRoute("/notifications/:id", NotificationController, 'delete');
    }

    // Invocando o método de registro no carregamento da classe
    static {
        this.registerRoutes();
    }
}

new NotificationRoutes(); 
