import { ApiExpress } from "./api/express/ApiExpress";
import cluster from "cluster";
import os from "os";
import { NotificationRoutes } from "./api/express/routes/NotificationRoutes";

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Cria um worker para cada núcleo de CPU
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    const api = ApiExpress.getInstance(); // Obtém a instância do ApiExpress

    // O registro de rotas é feito automaticamente na inicialização do NotificationRoutes
    // No entanto, você pode chamar explicitamente se preferir
    new NotificationRoutes(); // Não é necessário, pois as rotas são registradas automaticamente.

    // Início do servidor
    api.start(8000);
}
