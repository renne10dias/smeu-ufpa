import { Request, Response } from "express";

import cors from 'cors';

export class ApiExpress {
    private static instance: ApiExpress;
    private routes: { method: string; path: string; handler: Function | Function[] }[] = [];

    private constructor() {}

    public static getInstance(): ApiExpress {
        if (!ApiExpress.instance) {
            ApiExpress.instance = new ApiExpress();
        }
        return ApiExpress.instance;
    }

    // Definindo tipos para Controller e métodos
    public addPostRoute<T extends { build: () => any }>(path: string, Controller: T, methodName: string, uploadMiddleware?: any) {
        const controller = Controller.build();

        const handler = async (req: Request, res: Response) => {
            try {
                await controller[methodName](req, res);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        };

        if (uploadMiddleware) {
            this.routes.push({ method: 'POST', path, handler: [uploadMiddleware, handler] });
        } else {
            this.routes.push({ method: 'POST', path, handler });
        }
    }

    public addGetRoute<T extends { build: () => any }>(path: string, Controller: T, methodName: string) {
        const controller = Controller.build();

        const handler = async (req: Request, res: Response) => {
            try {
                await controller[methodName](req, res);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        };

        this.routes.push({ method: 'GET', path, handler });
    }

    public addPutRoute<T extends { build: () => any }>(path: string, Controller: T, methodName: string) {
        const controller = Controller.build();

        const handler = async (req: Request, res: Response) => {
            try {
                await controller[methodName](req, res);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        };

        this.routes.push({ method: 'PUT', path, handler });
    }

    public addDeleteRoute<T extends { build: () => any }>(path: string, Controller: T, methodName: string) {
        const controller = Controller.build();

        const handler = async (req: Request, res: Response) => {
            try {
                await controller[methodName](req, res);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        };

        this.routes.push({ method: 'DELETE', path, handler });
    }

    public start(port: number) {
        const express = require('express');
        const app = express();

        app.use(express.json());
        app.use(cors());

        this.routes.forEach(route => {
            if (Array.isArray(route.handler)) {
                app[route.method.toLowerCase()](route.path, ...route.handler);
            } else {
                app[route.method.toLowerCase()](route.path, route.handler);
            }
        });

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
}
