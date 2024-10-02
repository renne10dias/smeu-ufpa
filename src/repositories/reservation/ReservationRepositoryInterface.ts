import { Reservation } from "../../entities/Reservation";


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



export interface ReservationRepositoryInterface {
    create(reservation: Reservation): Promise<void>;

}