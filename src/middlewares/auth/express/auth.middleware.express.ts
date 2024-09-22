import { Request, Response, NextFunction } from "express";
import { MiddlewareServiceImplementation } from "../../service/implementation/service.middleware.implementation";

export class MiddlewareAuthExpress {

    private constructor(readonly authService: MiddlewareServiceImplementation) {}

    public static build(authService: MiddlewareServiceImplementation) {
        return new MiddlewareAuthExpress(authService);
    }




    public authenticate(allowedRoles: string[]) {
        return async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
            const token = request.headers['authorization'];

            if (!token) {
                return response.status(401).json({ message: 'No token provided' });
            }

            const isValid = await this.authService.validateToken(token);
            if (!isValid) {
                return response.status(401).json({ message: 'Invalid token' });
            }

            try {
                const userType = await this.authService.getUserType(token);
                if (!allowedRoles.includes(userType)) {
                    return response.status(403).json({ message: 'Access forbidden: insufficient permissions' });
                }
                next();
            } catch (error) {
                return response.status(401).json({ message: 'Invalid token' });
            }
        };
    }


    
}