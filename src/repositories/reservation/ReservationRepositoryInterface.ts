import { Reservation } from "../../entities/Reservation";

export type getReservationWithShiftRepositoryOutputDto = {
    uuid: string,
    startDate: string,
    endDate: string,
    status: string,
    details: string,
    createdAt: string,
    spaceId: string,
    userId: string,
    shiftId: string,
    shift: {
        uuid: string,
        nameShift: string
    }[];
};

export type getReservationRepositoryOutputDto = {
    uuid: string,
    startDate: string,
    endDate: string,
    details: string,
    shift: {
        uuid: string,
        nameShift: string
    }[];
};

export type getReservation_existsOutputDto = {
    spaceId: string,
    userId: string,
    shiftId: string,
    shift: {
        uuid: string,
    }[];
};




export interface ReservationRepositoryInterface {
    create(reservation: Reservation): Promise<Boolean>;
    addShiftToReservation(reservationUuid: string, shiftId: string, spaceId: string, userId: string): Promise<Boolean>;
    //check_reservation(reservation: Reservation): Promise<Boolean>;
    getReservationWithShift(reservationUuid: string): Promise<getReservationWithShiftRepositoryOutputDto[]>;
    listAllReservationsWithShifts(): Promise<getReservationWithShiftRepositoryOutputDto[]>;
    listAllReservations(): Promise<getReservationRepositoryOutputDto[]>;
}