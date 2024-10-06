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
    startDate: Date,
    endDate: Date,
    details: string,
    status: string,
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


export type getReservationDetails = {
    uuid: string,
    startDate: string,
    endDate: string,
    status: string,
    details: string,
    createdAt: string,
    shift: {
        uuid: string,
        nameShift: string
    },
    user: {
        uuid: string,
        name: string,
        email: string
    },
    space: { // Ensure this is a single object
        uuid: string,
        name: string,
        files: {
            path: string
        }[]
    };
};

export type getReservationOutput = {
    uuid: string,
    status: string,
    createdAt: string,
    user: {
        name: string,
        role: string,
    },
    space: { // Ensure this is a single object
        name: string,
    };
};





export interface ReservationRepositoryInterface {
    create(reservation: Reservation): Promise<Boolean>;
    updateReservationStatus(uuid: string): Promise<boolean>;

    addShiftToReservation(reservationUuid: string, shiftId: string, spaceId: string, userId: string): Promise<Boolean>;

    getAllReservations(): Promise<getReservationOutput[] | null>;
    getReservationDetailsByUuid(uuid: string): Promise<getReservationDetails | null>;

    checkShiftAvailability(startDate: Date, endDate: Date, shiftId: string): Promise<Boolean>;
    
    getReservationWithShift(reservationUuid: string): Promise<getReservationWithShiftRepositoryOutputDto[]>;
    listAllReservationsWithShifts(): Promise<getReservationWithShiftRepositoryOutputDto[]>;
    listAllReservations(): Promise<getReservationRepositoryOutputDto[]>;
}