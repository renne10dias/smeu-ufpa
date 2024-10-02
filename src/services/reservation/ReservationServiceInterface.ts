import { Reservation } from "../../entities/Reservation";

export type CreateOutputDto_service = {
    message: string;
};


/*
export type ListServiceOutputDto_service = {
    uuid: string;
    startDate: string,
    endDate: string,
    status: string,
    details: string,
    spaceId: string,
    userId: string,
    shiftId: string,
    createdAt: string,
};

*/
 




export interface ReservationServiceInterface {
    create(reservation: Reservation): Promise<CreateOutputDto_service>;
}
  