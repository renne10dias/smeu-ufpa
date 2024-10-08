import { AuthService } from '../../../auth/AuthService';
import { Request, Response } from "express";
import Joi from 'joi';

export class AuthController {

    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    // Método estático para construir o controlador
    public static build() {
        const authService = new AuthService();
        return new AuthController(authService);
    }

    // Método de login
    public async login(request: Request, response: Response) {
        // Definição do schema de validação usando Joi
        const reservationSchema = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
        });

        // Validação do corpo da requisição
        const { error } = reservationSchema.validate(request.body);
        if (error) {
            return response.status(400).json({ error: 'Validation error: ' + error.details[0].message });
        }

        const { email, password } = request.body;

        try {
            const output = await this.authService.login(email, password);

            // Salva o token como cookie
            response.cookie('jwt', output.token, {
                httpOnly: true, // Para proteger contra ataques XSS
                secure: process.env.NODE_ENV === 'production', // Usa 'secure' em produção
                maxAge: 3600000, // Tempo de vida do cookie (1 hora)
            });

            // Retorna a mensagem e o link de redirecionamento na resposta
            return response.status(output.httpCode).json({
                message: output.message,
                redirectUrl: output.redirectUrl, // URL de redirecionamento
            });

        } catch (error) {
            // Corrigido para usar `response` em vez de `res`
            return response.status(401).json({ error: (error as Error).message });
        }
    }
}
