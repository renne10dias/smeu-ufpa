import { ApiExpress } from "./api/express/ApiExpress";
import cluster from "cluster";
import os from "os";

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Cria um worker para cada núcleo de CPU
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork(); // Reinicia o worker
    });
} else {
    const api = ApiExpress.getInstance(); // Obtém a instância do ApiExpress

    // Início do servidor
    api.start(8000);
}