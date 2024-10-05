import { ApiExpress } from "./api/express/ApiExpress";
import { NotificationRoutes } from "./api/express/routes/NotificationRoutes";
import { ReservationRoutes } from "./api/express/routes/ReservationRoutes";
import { SpaceRoutes } from "./api/express/routes/SpaceRoutes";
import { UserRoutes } from "./api/express/routes/UserRoutes";
import { ImageRoutes } from "./api/express/routes/ImageRoutes";

function main() {
    const api = ApiExpress.getInstance(); // Obtém a instância do ApiExpress

    // Instancia a classe e registra as rotas automaticamente
    NotificationRoutes.registerRoutes(ApiExpress.getInstance());
    SpaceRoutes.registerRoutes(ApiExpress.getInstance());
    UserRoutes.registerRoutes(ApiExpress.getInstance());
    ReservationRoutes.registerRoutes(ApiExpress.getInstance());
    ImageRoutes.registerRoutes(ApiExpress.getInstance());

    // Início do servidor
    api.start(8000);
}

main();
