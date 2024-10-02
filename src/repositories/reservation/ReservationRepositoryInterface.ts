import { Reservation } from "../../entities/Reservation";






export interface ReservationRepositoryInterface {
    create(reservation: Reservation): Promise<Boolean>;
    

}