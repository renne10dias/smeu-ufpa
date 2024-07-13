import { Request, Response, NextFunction } from "express";
import { AuthMiddleware } from "../middleware.auth";

export class MiddlewareAuthExpress implements AuthMiddleware {

    public async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
        const token = req.headers['authorization'];

        

        next();
    }

    

}