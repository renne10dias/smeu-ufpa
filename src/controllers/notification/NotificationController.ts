import { Request, Response } from "express";
import { prisma } from "../../util/prisma.util";
import { NotificationRepository } from "../../repositories/notification/prisma/NotificationRepository";
import { NotificationService } from "../../services/notification/implementation/NotificationService";
import { Notification } from "../../entities/Notification";

export class NotificationController {
    private notificationService: NotificationService;

    constructor(notificationService: NotificationService) {
        this.notificationService = notificationService;
    }

    // Método estático para construir o controlador
    public static build() {
        const notificationRepository = NotificationRepository.build(prisma);
        const notificationService = NotificationService.build(notificationRepository);
        return new NotificationController(notificationService);
    }

    // Método para criar uma notificação
    public async create(request: Request, response: Response): Promise<Response> {
        try {
            const { type, status } = request.body;

            // Validação de dados (pode ser feita com uma biblioteca como Joi ou class-validator)
            if (!type || typeof status === 'undefined') {
                return response.status(400).json({ error: 'Campos "type" e "status" são obrigatórios.' });
            }

            // Criação de uma nova notificação
            const notification = new Notification(type, new Date(), status); // UUID será gerado no serviço
            const output = await this.notificationService.create(notification);

            return response.status(201).json(output); // Status 201 para criação
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }


    public async find(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;

            const output = await this.notificationService.find(id)

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }


    // Método para atualizar uma notificação
    public async update(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;
            const { type, status } = request.body;

            // Validação de dados
            if (!id || !type || typeof status === 'undefined') {
                return response.status(400).json({ error: 'Campos "id", "type" e "status" são obrigatórios.' });
            }

            // Verificar se a notificação existe antes de atualizar
            const notificationExists = await this.notificationService.find(id);
            if (!notificationExists) {
                return response.status(404).json({ error: 'Notificação não encontrada.' });
            }

            // Atualiza a notificação existente
            await this.notificationService.update({
                uuid: id,
                type,
                sendDate: new Date(), // A data de envio é atualizada para o momento atual, mas pode ser ajustado conforme necessário
                status
            });

            return response.status(204).send(); // Status 204 para operação bem-sucedida sem resposta
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }
}
