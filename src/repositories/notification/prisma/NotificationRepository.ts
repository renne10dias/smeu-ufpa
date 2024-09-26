import { PrismaClient } from "@prisma/client";
import { FindOutputDto_repository, ListOutputDto_repository, NotificationRepositoryInterface, UpdateInputDto_repository } from "../NotificationRepositoryInterface";
import { Notification } from "../../../entities/Notification";

export class NotificationRepository implements NotificationRepositoryInterface {

    private constructor(readonly prisma: PrismaClient) {}
    public static build(prisma: PrismaClient) {
        return new NotificationRepository(prisma);
    }

    
    // Save (Create)
    public async create(notification: Notification): Promise<void> {
        await this.prisma.notification.create({
            data: {
                uuid: notification.getUuid(),
                type: notification.getType(),
                sendDate: notification.getSendDate(),
                status: notification.getStatus(),
            },
        });
    }

    // Find (Read)
    public async find(uuid: string): Promise<FindOutputDto_repository | null> {
        const aNotification = await this.prisma.notification.findUnique({ where: { uuid } });
        if (!aNotification) return null;
        return {
            uuid: aNotification.uuid,
            type: aNotification.type,
            sendDate: aNotification.sendDate,
            status: aNotification.status,
        };
    }

    // List (Read)
    public async list(): Promise<ListOutputDto_repository[]> {
        const aNotification = await this.prisma.notification.findMany();
        return aNotification.map(notification => ({
            uuid: notification.uuid,
            type: notification.type,
            sendDate: notification.sendDate,
            status: notification.status,
        }));
    }


    // Update
    public async update(notificationDto: UpdateInputDto_repository): Promise<void> {
        const { uuid, type, sendDate, status } = notificationDto;
        await this.prisma.notification.update({
            where: { uuid },
            data: {
                uuid,
                type,
                sendDate,
                status
            },
        });
    }

    public async delete(uuid: string): Promise<void> {
        await this.prisma.notification.delete({
            where: { uuid },
        });
    }


}