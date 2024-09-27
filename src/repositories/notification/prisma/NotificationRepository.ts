import { PrismaClient } from "@prisma/client";
import {
    FindOutputDto_repository,
    ListOutputDto_repository,
    NotificationRepositoryInterface,
    UpdateInputDto_repository
} 
from "../NotificationRepositoryInterface";
import { Notification } from "../../../entities/Notification";

export class NotificationRepository implements NotificationRepositoryInterface {
    private constructor(readonly prisma: PrismaClient) {}

    // Método estático para construir o repositório
    public static build(prisma: PrismaClient) {
        return new NotificationRepository(prisma);
    }

    // Create (Salvar uma nova notificação)
    public async create(notification: Notification): Promise<void> {
        try {
            await this.prisma.notification.create({
                data: {
                    uuid: notification.getUuid(),    // Garante que o UUID foi atribuído no serviço
                    type: notification.getType(),
                    sendDate: notification.getSendDate(),
                    status: notification.getStatus(),
                },
            });
        } catch (error) {
            throw new Error("Erro ao criar notificação");
        }
    }

    // Find (Buscar uma notificação por UUID)
    public async find(uuid: string): Promise<FindOutputDto_repository | null> {
        try {
            const notification = await this.prisma.notification.findUnique({ where: { uuid } });
            if (!notification) {
                return null;
            }
            return {
                uuid: notification.uuid,
                type: notification.type,
                sendDate: notification.sendDate,
                status: notification.status,
            };
        } catch (error) {
            throw new Error("Erro ao buscar notificação");
        }
    }

    // List (Listar todas as notificações)
    public async list(): Promise<ListOutputDto_repository[]> {
        try {
            const notifications = await this.prisma.notification.findMany();
            return notifications.map(notification => ({
                uuid: notification.uuid,
                type: notification.type,
                sendDate: notification.sendDate,
                status: notification.status,
            }));
        } catch (error) {
            throw new Error("Erro ao listar notificações");
        }
    }

    // Update (Atualizar uma notificação existente)
    public async update(notificationDto: UpdateInputDto_repository): Promise<void> {
        const { uuid, type, sendDate, status } = notificationDto;
        try {
            await this.prisma.notification.update({
                where: { uuid },
                data: {
                    type,
                    sendDate,
                    status,
                },
            });
        } catch (error) {
            throw new Error("Erro ao atualizar notificação");
        }
    }

    // Delete (Deletar uma notificação pelo UUID)
    public async delete(uuid: string): Promise<void> {
        try {
            await this.prisma.notification.delete({
                where: { uuid },
            });
        } catch (error) {
            throw new Error("Erro ao deletar notificação");
        }
    }
}
