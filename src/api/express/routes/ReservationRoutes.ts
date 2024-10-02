import { ApiExpress } from "../ApiExpress";
import { ReservationController } from "../controllers/ReservationController";

export class ReservationRoutes {
    public static registerRoutes(api: ApiExpress) {
        api.addPostRoute("/reservation", ReservationController, 'create');
    }
}

