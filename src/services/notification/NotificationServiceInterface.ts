import { Notification } from "../../entities/Notification";

export type CreateOutputDto_Service = {
    uuid?: string;
};

export type FindOutputDto_Service = {
    uuid: string;
    type: string;
    sendDate: Date;
    status: string;
};

export type ListOutputDto_Service = {
    uuid: string;
    type: string;
    sendDate: Date;
    status: string;
};


export type UpdateInputDto_Service = {
    uuid: string;
    type: string;
    sendDate: Date;
    status: string;
};



export interface NotificationServiceInterface {
    create(notification: Notification): Promise<CreateOutputDto_Service>;
    find(id: string): Promise<FindOutputDto_Service | null>;
    list(): Promise<ListOutputDto_Service[]>;
    update(notificationDto: UpdateInputDto_Service): Promise<void>;
    delete(id: string): Promise<void>;
}