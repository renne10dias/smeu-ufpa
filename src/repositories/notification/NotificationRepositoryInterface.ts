import { Notification } from "../../entities/Notification";

export type CreateOutputDto_repository = {
    uuid: string;
};

export type FindOutputDto_repository = {
    uuid: string;
    type: string;
    sendDate: Date;
    status: string;
};

export type ListOutputDto_repository = {
    uuid: string;
    type: string;
    sendDate: Date;
    status: string;
};


export type UpdateInputDto_repository = {
    uuid: string;
    type: string;
    sendDate: Date;
    status: string;
};



export interface NotificationRepositoryInterface {
    create(notification: Notification): Promise<void>;
    find(id: string): Promise<FindOutputDto_repository | null>;
    list(): Promise<ListOutputDto_repository[]>;
    update(notificationDto: UpdateInputDto_repository): Promise<void>;
    delete(id: string): Promise<void>;

}