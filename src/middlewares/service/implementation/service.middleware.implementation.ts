import { ServiceMiddleware } from "../middleware.service";

export class MiddlewareServiceImplementation implements ServiceMiddleware {


    public async validateToken(token: string): Promise<boolean> {
        // Implementação fictícia de validação de token
        return token === 'valid-token';
    }

    public async getUserType(token: string): Promise<string> {
        // Implementação fictícia para obter o tipo de usuário do token
        if (token === 'valid-token-admin') {
            return 'admin';
        } else if (token === 'valid-token-user') {
            return 'user';
        } else {
            throw new Error('Invalid token');
        }
    }

}