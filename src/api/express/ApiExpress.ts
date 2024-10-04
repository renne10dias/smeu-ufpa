import { Request, Response } from "express";
import { MulterConfig } from "../../util/multer/MulterConfig"; 

import cors from 'cors'; // Importa o pacote CORS

export class ApiExpress {
    private static instance: ApiExpress; // Variável estática para armazenar a instância única
    private routes: { method: string; path: string; handler: Function | Function[] }[] = []; // Aceita uma função ou um array de funções


    // Construtor privado para evitar a instância externa
    private constructor() {}

    // Método para obter a instância única
    public static getInstance(): ApiExpress {
        if (!ApiExpress.instance) {
            ApiExpress.instance = new ApiExpress(); // Cria uma nova instância se não existir
        }
        return ApiExpress.instance; // Retorna a instância única
    }

    // Método para adicionar rotas POST com suporte ao upload de arquivos
    public addPostRoute(path: string, Controller: any, methodName: string, uploadMiddleware?: any) {
        const controller = Controller.build(); // Instancia o controlador

        const handler = async (req: Request, res: Response) => {
            try {
                await controller[methodName](req, res);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        };

        // Se houver middleware para upload de arquivos, usa ele
        if (uploadMiddleware) {
            this.routes.push({ method: 'POST', path, handler: [uploadMiddleware, handler] });
        } else {
            this.routes.push({ method: 'POST', path, handler });
        }
    }



    // Método para adicionar rotas GET
    public addGetRoute(path: string, Controller: any, methodName: string) {
        const controller = Controller.build(); // Instancia o controlador

        const handler = async (req: Request, res: Response) => {
            try {
                await controller[methodName](req, res);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        };

        this.routes.push({ method: 'GET', path, handler });
    }

    // Método para adicionar rotas PUT
    public addPutRoute(path: string, Controller: any, methodName: string) {
        const controller = Controller.build(); // Instancia o controlador

        const handler = async (req: Request, res: Response) => {
            try {
                await controller[methodName](req, res);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        };

        this.routes.push({ method: 'PUT', path, handler });
    }

    // Método para adicionar rotas DELETE
    public addDeleteRoute(path: string, Controller: any, methodName: string) {
        const controller = Controller.build(); // Instancia o controlador

        const handler = async (req: Request, res: Response) => {
            try {
                await controller[methodName](req, res);
            } catch (error) {
                res.status(500).json({ error: (error as Error).message });
            }
        };

        this.routes.push({ method: 'DELETE', path, handler });
    }

     // Método para iniciar o servidor e registrar as rotas
     public start(port: number) {
        const express = require('express');
        const app = express();

        // Middleware para parsing de JSON
        app.use(express.json());

        // Middleware para habilitar o CORS
        app.use(cors());

        // Adiciona as rotas ao express
        this.routes.forEach(route => {
            // Usa o método express e passa o handler como função ou array de funções
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
