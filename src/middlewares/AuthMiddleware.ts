import { Request, Response, NextFunction } from "express";
import { AuthJwt } from "../util/jwt/AuthJwt"; // Ajuste o caminho para a classe AuthJwt

export class AuthMiddleware {
    private authJwt: AuthJwt;

    constructor(secret: string) {
        this.authJwt = new AuthJwt(secret);
    }

    public verifyToken = (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers['authorization']?.split(' ')[1]; // Pega o token do cabeçalho Authorization

        if (!token) {
            return res.status(401).json({ error: "Token não fornecido" }); // Retorna erro se não houver token
        }

        try {
            const decoded = this.authJwt.verifyToken(token); // Verifica o token
        
            next(); // Passa para o próximo middleware ou rota
        } catch (error) {
            return res.status(401).json({ error: "Token inválido" }); // Retorna erro se o token for inválido
        }
    };
}
