import { ApiExpress } from "./api/express/ApiExpress";
import { NotificationRoutes } from "./api/express/routes/NotificationRoutes";

function main() {
    const api = ApiExpress.getInstance(); // Obtém a instância do ApiExpress

    // Início do servidor
    api.start(8000);
}

main();
