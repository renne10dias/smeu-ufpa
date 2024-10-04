import { ApiExpress } from "../ApiExpress";
import { ReservationController } from "../controllers/ReservationController";

export class ReservationRoutes {
    public static registerRoutes(api: ApiExpress) {
        api.addPostRoute("/reservation", ReservationController, 'create');
        api.addPostRoute("/reservation/create-shift", ReservationController, 'insertShift');
        api.addGetRoute("/reservation/get-reservation-with-shift/:reservationUuid", ReservationController, 'getReservationWithShift');
        api.addGetRoute("/reservation/list-all-reservations-with-shifts", ReservationController, 'listAllReservationsWithShifts');
        api.addGetRoute("/reservation/list-all-reservations", ReservationController, 'listAllReservations');
    }
}

