import { Request, Response } from "express";
import { prisma } from "../../../util/prisma.util";
import { UsersRepositoryPrisma } from "../../../repositories/users/prisma/users.repository.prisma";
import { UsersServiceImplementation } from "../../../services/users/implementation/users.service.implementation";
import { UsersRepository } from "../../../repositories/users/users.repository";
import { UsersService } from "../../../services/users/users.service";
import { NotificationRepository } from "../../../repositories/notification/prisma/NotificationRepository";
import { NotificationService } from "../../../services/notification/implementation/NotificationService";

export class NotificationController {
    
    private notificationService: NotificationService;

    constructor(notificationService: NotificationService) {
        this.notificationService = notificationService;
    }

    // Método estático para construir o controlador
    public static build() {
        const notificationRepository = NotificationRepository.build(prisma);
        const notificationService = NotificationService.build(notificationRepository)
        return new NotificationController(notificationService);
    }

    // Método para criar um usuário
    public async create(request: Request, response: Response): Promise<Response> {
        try {
            const { name, surname, email, password, user_types_id } = request.body;

            // Cria um novo usuário
            const output = await this.notificationService.create(name, surname, email, password, user_types_id);

            return response.status(201).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }

    // Método para atualizar um usuário
    public async update(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;
            const { name, surname, email } = request.body;

            // Atualiza o usuário existente
            const output = await this.notificationService.update(id, name, surname, email);

            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }
}
