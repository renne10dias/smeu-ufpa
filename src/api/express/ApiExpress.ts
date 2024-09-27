import { Request, Response } from "express";

interface RouteHandler {
    middlewares: Function[];
    handler: Function;
}

export class ApiExpress {
    private routes: { method: string; path: string; handler: RouteHandler }[] = [];

    // Método para adicionar rotas POST
    public addPostRoute(path: string, middlewares: Function[] = [], Controller: any, methodName: string) {
        const controller = Controller.build(); // Instancia o controlador

        const handler = async (req: Request, res: Response) => {
            try {
                await controller[methodName](req, res);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        };

        this.routes.push({ method: 'POST', path, handler: { middlewares, handler } });
    }

    // Método para adicionar rotas GET
    public addGetRoute(path: string, middlewares: Function[] = [], Controller: any, methodName: string) {
        const controller = Controller.build(); // Instancia o controlador

        const handler = async (req: Request, res: Response) => {
            try {
                await controller[methodName](req, res);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        };

        this.routes.push({ method: 'GET', path, handler: { middlewares, handler } });
    }

    // Método para adicionar rotas PUT
    public addPutRoute(path: string, middlewares: Function[] = [], Controller: any, methodName: string) {
        const controller = Controller.build(); // Instancia o controlador

        const handler = async (req: Request, res: Response) => {
            try {
                await controller[methodName](req, res);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        };

        this.routes.push({ method: 'PUT', path, handler: { middlewares, handler } });
    }

    // Método para adicionar rotas DELETE
    public addDeleteRoute(path: string, middlewares: Function[] = [], Controller: any, methodName: string) {
        const controller = Controller.build(); // Instancia o controlador

        const handler = async (req: Request, res: Response) => {
            try {
                await controller[methodName](req, res);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        };

        this.routes.push({ method: 'DELETE', path, handler: { middlewares, handler } });
    }

    // Método para iniciar o servidor e registrar as rotas
    public start(port: number) {
        const express = require('express');
        const app = express();

        // Middleware para parsing de JSON
        app.use(express.json());

        // Adiciona as rotas ao express
        this.routes.forEach(route => {
            const { middlewares, handler } = route.handler;
            app[route.method.toLowerCase()](route.path, ...middlewares, handler);
        });

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
}
