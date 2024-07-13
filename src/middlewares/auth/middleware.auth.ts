import { NextFunction, Request, Response } from "express";

export interface AuthMiddleware {
    authenticate(req: Request, res: Response, next: NextFunction): Promise<void>;
}