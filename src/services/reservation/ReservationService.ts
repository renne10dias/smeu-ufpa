import { Reservation } from "../../entities/Reservation";
import { ReservationRepositoryInterface } from "../../repositories/reservation/ReservationRepositoryInterface";
import { ReservationRepository } from "../../repositories/reservation/prisma/ReservationRepository";
import crypto from "crypto";  // For UUID generation
import { CreateOutputDto_service, 
        ReservationServiceInterface,
        UpdateOutputDto_service } from "../../services/reservation/ReservationServiceInterface";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Request } from 'express';


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
        const uuid = crypto.randomUUID();  // Gera um UUID único
        reservation.setUuid(uuid);
        
        try {
            // Verifica se a data de início é anterior à data atual
        const now = new Date();
        if (reservation.getStartDate() < now) {
            return {
                httpCode: 400,  // Bad Request
                //message: 'A data de início da reserva não pode ser anterior à data atual.'
            };
        }

        // Verifica se a data de término é anterior à data de início
        if (reservation.getEndDate() <= reservation.getStartDate()) {
            return {
                httpCode: 400,  // Bad Request
                //message: 'A data de término da reserva deve ser posterior à data de início.'
            };
        }

            // Verifica a disponibilidade de turno para cada turno solicitado no intervalo de datas
            for (const shiftId of reservation.getShiftIds()) {
                const isAvailable = await this.repository.checkShiftAvailability(reservation.getStartDate(), reservation.getEndDate(), shiftId);
                if (!isAvailable) {
                    //throw new Error(`Turno ${shiftId} já está reservado para o intervalo de datas fornecido.`);
                    return {
                        httpCode: 404
                    };
                }
            }
    
            // Tenta criar a reserva no repositório
            const result = await this.repository.create(reservation);
            if (result) {
                return {
                    httpCode: 201
                };
            } else {
                return {
                    httpCode: 500
                };
            }
    
        } catch (error) {
            console.error("Erro ao criar a reserva:", error);
            throw new Error("Erro ao criar a reserva, tente novamente mais tarde.");
        }
    }

   
    
    

    public async updateReservationStatus(uuid: string): Promise<UpdateOutputDto_service> {
        try {

            const result = await this.repository.updateReservationStatus(uuid);  // Create reservation in the repository
            if (result) {
                return {
                    message: "Reserva Confirmada"
                };
            } else {
                return {
                    message: "Alguma erro aconteceu"
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

    public async getAllReservations() {
        try {
            const reservations = await this.repository.getAllReservations();


            // Se necessário, você pode realizar mais lógica de negócios aqui
            return reservations;

        } catch (error) {
            console.error('Erro ao buscar reserva com turno no serviço:', error);
            throw new Error('Erro ao buscar reserva no serviço');
        }
    }

    public async getReservationDetailsByUuid(request: Request, uuid: string) {
        try {
            const reservation = await this.repository.getReservationDetailsByUuid(uuid);
        
            if (!reservation) {
                return null; // Return null if the reservation is not found
            }
        
            const hostUrl = `${request.protocol}://${request.get('host')}`;
    
            // Building the response with full URL for the files
            const reservationWithUrls = {
                uuid: reservation.uuid,
                startDate: reservation.startDate,
                endDate: reservation.endDate,
                status: reservation.status,
                details: reservation.details,
                createdAt: reservation.createdAt,
                shift: {
                    uuid: reservation.shift.uuid,
                    nameShift: reservation.shift.nameShift,
                },
                user: {
                    uuid: reservation.user.uuid,
                    name: reservation.user.name,
                    email: reservation.user.email,
                },
                space: {
                    uuid: reservation.space.uuid,
                    name: reservation.space.name,
                    files: reservation.space.files.map(file => ({
                        // Dynamically build the full URL for the file paths
                        path: `${hostUrl}/image/${file.path}`,
                    })),
                }
            };
        
            return reservationWithUrls;
        
        } catch (error) {
            console.error('Erro ao buscar a reserva no serviço:', error);
            throw new Error('Erro ao buscar a reserva no serviço');
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

    public async listAllReservationsWithShifts() {
        try {
            const reservations = await this.repository.listAllReservationsWithShifts();


            // Se necessário, você pode realizar mais lógica de negócios aqui
            return reservations;

        } catch (error) {
            console.error('Erro ao buscar reserva com turno no serviço:', error);
            throw new Error('Erro ao buscar reserva no serviço');
        }
    }


    public async listAllReservations() {
        try {
            // Chama a função para verificar e deletar reservas expiradas
            const check = await this.repository.listAndCheckReservations();
    
            // Busca todas as reservas
            const reservations = await this.repository.listAllReservations();
    
            // Se necessário, você pode realizar mais lógica de negócios aqui
            return reservations;
    
        } catch (error) {
            console.error('Erro ao buscar reserva com turno no serviço:', error);
            throw new Error('Erro ao buscar reserva no serviço');
        }
    }
    

    



}
