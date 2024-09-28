import { Request, Response } from "express";
import express, { RequestHandler } from "express";
import winston from "winston";

export class ApiExpress {
    private static instance: ApiExpress;
    private routes: { method: 'GET' | 'POST' | 'PUT' | 'DELETE'; path: string; handler: RequestHandler }[] = [];
    private logger: winston.Logger;

    private constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
                new winston.transports.File({ filename: 'logs/combined.log' }),
            ],
        });
    }

    public static getInstance(): ApiExpress {
        if (!ApiExpress.instance) {
            ApiExpress.instance = new ApiExpress();
        }
        return ApiExpress.instance;
    }

    public addPostRoute(path: string, Controller: any, methodName: string) {
        const controller = Controller.build();
        const handler = this.createHandler(controller, methodName);
        this.routes.push({ method: 'POST', path, handler });
    }

    public addGetRoute(path: string, Controller: any, methodName: string) {
        const controller = Controller.build();
        const handler = this.createHandler(controller, methodName);
        this.routes.push({ method: 'GET', path, handler });
    }

    public addPutRoute(path: string, Controller: any, methodName: string) {
        const controller = Controller.build();
        const handler = this.createHandler(controller, methodName);
        this.routes.push({ method: 'PUT', path, handler });
    }

    public addDeleteRoute(path: string, Controller: any, methodName: string) {
        const controller = Controller.build();
        const handler = this.createHandler(controller, methodName);
        this.routes.push({ method: 'DELETE', path, handler });
    }

    private createHandler(controller: any, methodName: string) {
        return async (req: Request, res: Response) => {
            try {
                await controller[methodName](req, res);
            } catch (error) {
                this.logger.error(`Error: ${(error as Error).message}`);
                res.status(500).json({ error: (error as Error).message });
            }
        };
    }

    public start(port: number) {
        const app = express();
        app.use(express.json());

        this.routes.forEach(route => {
            // Mude aqui
            app[route.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete'](route.path, route.handler);
        });

        // Middleware de controle de erros
        app.use((err: Error, req: Request, res: Response, next: Function) => {
            this.logger.error(`Error: ${err.message}`);
            res.status(500).json({ error: err.message });
        });

        app.listen(port, () => {
            this.logger.info(`Server running on port ${port}`);
            console.log(`Server running on port ${port}`);
        });
    }
}