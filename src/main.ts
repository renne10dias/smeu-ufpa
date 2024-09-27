import { ApiExpress } from "./api/express/ApiExpress";
import { NotificationController } from "./api/express/controllers/NotificationController";

function main() {
    const api = new ApiExpress();

    

    // Rotas de Notificações
    api.addPostRoute("/notifications", NotificationController, 'create'); // Uso simplificado
    api.addGetRoute("/notifications/:id", NotificationController, 'find'); // Exemplo de GET
    api.addPutRoute("/notifications/:id", NotificationController, 'update'); // Exemplo de PUT
    api.addDeleteRoute("/notifications/:id", NotificationController, 'delete'); // Exemplo de DELETE

    // Início do servidor
    api.start(8000);
}

main();
