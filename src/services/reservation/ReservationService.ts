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
                    message: "acho que funcionou"
                };
            } else {
                return {
                    message: "Alguma merda aconteceu"
                };
            }
           
                

        } catch (error) {
            console.error("Error while creating reservation:", error);
            throw new Error("Error while creating reservation");
        }
    }


    /*
    public async create(reservation: Reservation): Promise<CreateOutputDto_service> {
        const uuid = crypto.randomUUID();  // Generate a unique UUID
        reservation.setUuid(uuid);
        
        try {

            if (reservation.getStartDate() >= reservation.getEndDate()) {
                return {
                    message: "A data de inicio deve ser maior que a data de termino"
                };
            }

             // Verifica se a reserva já existe
            const canCreate = await this.repository.check_reservation(reservation);

            if (canCreate) {
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

              } else {
                return { 
                    message: "Já existe uma reserva para o mesmo espaço, turno e data.",
                };
              }

        } catch (error) {
            console.error("Error while creating reservation:", error);
            throw new Error("Error while creating reservation");
        }
    }

    */


    
    public async getReservationWithShift(reservationUuid: string) {
        try {
            const reservations = await this.repository.getReservationWithShift(reservationUuid);

            if (!reservations || reservations.length === 0) {
                throw new Error('Nenhuma reserva encontrada para o turno especificado.');
            }

            // Se necessário, você pode realizar mais lógica de negócios aqui
            return reservations;

        } catch (error) {
            console.error('Erro ao buscar reserva com turno no serviço:', error);
            throw new Error('Erro ao buscar reserva no serviço');
        }
    }

    public async addShiftToReservation(reservationUuid: string, shiftId: string, spaceId: string, userId: string) {
        try {

            const result = await this.repository.addShiftToReservation(reservationUuid, shiftId, spaceId, userId);
            if (result) {
                return {
                    message: "acho que funcionou"
                };
            } else {
                return {
                    message: "Alguma merda aconteceu"
                };
            }


        } catch (error) {
            console.error('Erro ao buscar reserva com turno no serviço:', error);
            throw new Error('Erro ao buscar reserva no serviço');
        }
    }

    



}
