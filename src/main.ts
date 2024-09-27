import { ApiExpress } from "./api/express/ApiExpress";
import { NotificationController } from "./api/express/controllers/NotificationController";
import { AuthMiddleware } from "./middlewares/AuthMiddleware"; // Ajuste o caminho conforme necessário

function main() {
    const api = new ApiExpress();

    // Rotas de Notificações
    api.addPostRoute("/notifications", [], NotificationController, 'create'); // Rota sem middleware
    api.addGetRoute("/notifications/:id", [AuthMiddleware], NotificationController, 'find'); // Exemplo de GET com middleware
    api.addPutRoute("/notifications/:id", [AuthMiddleware], NotificationController, 'update'); // Exemplo de PUT com middleware
    api.addDeleteRoute("/notifications/:id", [AuthMiddleware], NotificationController, 'delete'); // Exemplo de DELETE com middleware

    // Início do servidor
    api.start(8000);
}

main();
