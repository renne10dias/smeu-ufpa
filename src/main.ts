import { ApiExpress } from "./api/express/ApiExpress";
import { NotificationRoutes } from "./api/express/routes/NotificationRoutes";
import { SpaceRoutes } from "./api/express/routes/SpaceRoutes";

function main() {
    const api = ApiExpress.getInstance(); // Obtém a instância do ApiExpress

    // Instancia a classe e registra as rotas automaticamente
    NotificationRoutes.registerRoutes(ApiExpress.getInstance());
    SpaceRoutes.registerRoutes(ApiExpress.getInstance());

    // Início do servidor
    api.start(8000);
}

main();
