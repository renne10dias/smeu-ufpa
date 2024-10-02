import { Reservation } from "../../entities/Reservation";
import { ReservationRepositoryInterface } from "../../repositories/reservation/ReservationRepositoryInterface";
import { ReservationRepository } from "../../repositories/reservation/prisma/ReservationRepository";
import crypto from "crypto";  // For UUID generation
import { CreateOutputDto_service, ReservationServiceInterface } from "../../services/reservation/ReservationServiceInterface";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend Day.js with the necessary plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export class ReservationService implements ReservationServiceInterface {
    
    private constructor(readonly repository: ReservationRepositoryInterface) {}

    // Método estático para construir o serviço
    public static build(repository: ReservationRepository) {
        return new ReservationService(repository);
    }

    public async create(reservation: Reservation): Promise<CreateOutputDto_service> {
        const uuid = crypto.randomUUID();  // Generate a unique UUID
        reservation.setUuid(uuid);
        
        try {
            const result = await this.repository.create(reservation);  // Create reservation in the repository
            
            if (result) {
                return { 
                    message: "Reservation created successfully",
                };
            } else {
                return { 
                    message: "Failed to create reservation",
                };
            }
        } catch (error) {
            console.error("Error while creating reservation:", error);
            throw new Error("Error while creating reservation");
        }
    }
}
