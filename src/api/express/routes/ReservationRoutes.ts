import { ApiExpress } from "../ApiExpress";
import { ReservationController } from "../controllers/ReservationController";
import { AuthMiddleware } from "../../../middlewares/AuthMiddleware";
import { UserRoleEnum } from '../../../enums/UserRoleEnum';

export class ReservationRoutes {
    public static registerRoutes(api: ApiExpress) {

       

        api.addPostRoute("/reservation", ReservationController, 'create', AuthMiddleware.authenticateRoles([UserRoleEnum.ADMIN]));
        api.addPostRoute("/reservation/create-shift", ReservationController, 'insertShift', AuthMiddleware.authenticateRoles([UserRoleEnum.ADMIN]));
        api.addGetRoute("/reservation/get-reservation-with-shift/:reservationUuid", ReservationController, 'getReservationWithShift', AuthMiddleware.authenticateRoles([UserRoleEnum.ADMIN]));

        // reservas
        api.addGetRoute("/reservation/get-reservation/:uuid", ReservationController, 'getReservationDetailsByUuid', AuthMiddleware.authenticateRoles([UserRoleEnum.ADMIN]));
        api.addGetRoute("/reservation/get-all", ReservationController, 'getAllReservations', AuthMiddleware.authenticateRoles([UserRoleEnum.ADMIN]));
        api.addGetRoute("/reservation/confirm-reservation/:uuid", ReservationController, 'updateReservationStatus', AuthMiddleware.authenticateRoles([UserRoleEnum.ADMIN]));

        


        api.addGetRoute("/reservation/list-all-reservations-with-shifts", ReservationController, 'listAllReservationsWithShifts', AuthMiddleware.authenticateRoles([UserRoleEnum.ADMIN]));
        api.addGetRoute("/reservation/list-all-reservations", ReservationController, 'listAllReservations', AuthMiddleware.authenticateRoles([UserRoleEnum.ADMIN]));
    }
}

