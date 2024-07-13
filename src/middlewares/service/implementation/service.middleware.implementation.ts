import { ServiceMiddleware } from "../middleware.service";

export class MiddlewareServiceImplementation implements ServiceMiddleware {

    public async validateToken(token: string): Promise<boolean> {
        // Implementação fictícia de validação de token
        return token === 'valid-token';
    }

}