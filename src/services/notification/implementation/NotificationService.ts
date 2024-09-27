import { Notification } from "../../../entities/Notification";
import { 
    FindOutputDto_repository, 
    ListOutputDto_repository, 
    NotificationRepositoryInterface, 
    UpdateInputDto_repository 
} 
from "../../../repositories/notification/NotificationRepositoryInterface";
import { 
    CreateOutputDto_Service, 
    FindOutputDto_Service, 
    ListOutputDto_Service, 
    NotificationServiceInterface, 
    UpdateInputDto_Service 
} 
from "../NotificationServiceInterface";
import { NotificationRepository } from "../../../repositories/notification/prisma/NotificationRepository";
import crypto from "crypto";  // Importar biblioteca para gerar UUID

export class NotificationService implements NotificationServiceInterface {

    private constructor(readonly repository: NotificationRepository) {}

    // Método estático para construir o serviço
    public static build(repository: NotificationRepository) {
        return new NotificationService(repository);
    }

    /*
        A UUID deve ser gerada no serviço por razões semelhantes às da hash da senha.
        A geração de UUIDs é uma preocupação de aplicação, não de domínio.
    */

    // Cria uma nova notificação
    public async create(notification: Notification): Promise<CreateOutputDto_Service> {
        const uuid = crypto.randomUUID();  // Gera um UUID único
        
        notification.setUuid(uuid);  // Define o UUID na notificação

        try {
            await this.repository.create(notification);  // Cria a notificação no repositório
            return { uuid: notification.getUuid() };  // Retorna o UUID criado
        } catch (error) {
            throw new Error("Erro ao criar notificação");
        }
    }

    // Busca uma notificação pelo UUID
    public async find(uuid: string): Promise<FindOutputDto_Service | null> {
        try {
            const notification = await this.repository.find(uuid);
            if (!notification) {
                return null;
            }
            return this.mapToFindOutputDto(notification);
        } catch (error) {
            throw new Error("Erro ao buscar notificação");
        }
    }

    // Lista todas as notificações
    public async list(): Promise<ListOutputDto_Service[]> {
        try {
            const notifications = await this.repository.list();
            return notifications.map(this.mapToListOutputDto);
        } catch (error) {
            throw new Error("Erro ao listar notificações");
        }
    }

    // Atualiza uma notificação existente
    public async update(notificationDto: UpdateInputDto_Service): Promise<void> {
        try {
            await this.repository.update({
                uuid: notificationDto.uuid,
                type: notificationDto.type,
                sendDate: notificationDto.sendDate,
                status: notificationDto.status,
            });
        } catch (error) {
            throw new Error("Erro ao atualizar notificação");
        }
    }

    // Deleta uma notificação pelo UUID
    public async delete(uuid: string): Promise<void> {
        try {
            await this.repository.delete(uuid);
        } catch (error) {
            throw new Error("Erro ao deletar notificação");
        }
    }

    // Método privado para mapear um objeto de repositório para FindOutputDto
    private mapToFindOutputDto(notification: FindOutputDto_repository): FindOutputDto_Service {
        return {
            uuid: notification.uuid,
            type: notification.type,
            sendDate: notification.sendDate,
            status: notification.status,
        };
    }

    // Método privado para mapear um objeto de repositório para ListOutputDto
    private mapToListOutputDto(notification: ListOutputDto_repository): ListOutputDto_Service {
        return {
            uuid: notification.uuid,
            type: notification.type,
            sendDate: notification.sendDate,
            status: notification.status,
        };
    }
}
