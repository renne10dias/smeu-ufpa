import express from 'express';
import routes from './routes';  // Importa o arquivo index com todas as rotas

const app = express();
app.use(express.json());  // Middleware para lidar com JSON

// Usa todas as rotas definidas
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
