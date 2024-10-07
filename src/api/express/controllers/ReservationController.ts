import { Request, Response } from "express";
import { prisma } from "../../../util/prisma.util";
import { ReservationRepository } from "../../../repositories/reservation/prisma/ReservationRepository";
import { ReservationService } from "../../../services/reservation/ReservationService";
import { Reservation } from "../../../entities/Reservation";
import Joi from 'joi';

export class ReservationController {
    private reservationService: ReservationService;

    constructor(reservationService: ReservationService) {
        this.reservationService = reservationService;
    }

    // Método estático para construir o controlador
    public static build() {
        const reservationRepository = ReservationRepository.build(prisma);
        const reservationService = ReservationService.build(reservationRepository);
        return new ReservationController(reservationService);
    }






    // Método para criar uma reserva
    public async create(request: Request, response: Response): Promise<Response> {

        // Definição do schema de validação usando Joi
        const reservationSchema = Joi.object({
            startDate: Joi.date().required(),      // startDate deve ser uma data
            endDate: Joi.date().required(),        // endDate deve ser uma data
            status: Joi.boolean().required(),      // status deve ser booleano
            details: Joi.string().required(),      // details deve ser uma string
            spaceId: Joi.string().required(),      // spaceId deve ser uma string (UUID)
            userId: Joi.string().required(),       // userId deve ser uma string (UUID)
            shiftIds: Joi.array().items(Joi.string().uuid()).required()  // shiftIds deve ser um array de strings (UUIDs)
        });

        // Validação do corpo da requisição
        const { error } = reservationSchema.validate(request.body);
        if (error) {
            return response.status(400).json({ error: 'Validation error: ' + error.details[0].message });
        }

        try {
            // Extração dos dados da requisição
            const { startDate, endDate, status, details, spaceId, userId, shiftIds } = request.body;

            // Criação da entidade Reservation
            const reservation = new Reservation(startDate, endDate, status, details, spaceId, userId, shiftIds);

            // Chamada do serviço de criação da reserva
            // Chamada do serviço de criação da reserva
            const output = await this.reservationService.create(reservation);

            switch (output['httpCode']) {
                case 201:
                    return response.status(201).json({ message: "Reserva criada com sucesso." });
                case 404:
                    return response.status(404).json({ message: "Turno selecionado já está reservado para o intervalo de datas fornecido." });
                case 500:
                    return response.status(500).json({ message: "Falha ao criar reserva." });
                default:
                    return response.status(400).json({ message: "Erro inesperado. Por favor, tente novamente." });
            }


            // Retorna sucesso com o objeto criado
            return response.status(201).json(output);

        } catch (error) {
            // Tratamento de erros inesperados
            console.error("Error while creating reservation:", error);
            return response.status(500).json({ error: (error as Error).message });
        }
    }


    
    public async updateReservationStatus(request: Request, response: Response): Promise<Response> {
        try {

            const { uuid } = request.params;

            const output = await this.reservationService.updateReservationStatus(uuid);

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }

    public async getReservationWithShift(request: Request, response: Response): Promise<Response> {
        try {

            const { reservationUuid } = request.params;

            const output = await this.reservationService.getReservationWithShift(reservationUuid);

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }


    public async getAllReservations(request: Request, response: Response): Promise<Response> {
        try {

            const { uuid } = request.params;

            const output = await this.reservationService.getAllReservations();

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }




    public async getReservationDetailsByUuid(request: Request, response: Response): Promise<Response> {
        try {

            const { uuid } = request.params;

            const output = await this.reservationService.getReservationDetailsByUuid(request, uuid);

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }

    public async insertShift(request: Request, response: Response): Promise<Response> {
        try {
            const { reservationUuid, shiftId, spaceId, userId } = request.body;
        
            if (!reservationUuid || !shiftId) {
                return response.status(400).json({ error: "Reservation UUID and Shift ID are required." });
            }
        
            const output = await this.reservationService.addShiftToReservation(reservationUuid, shiftId, spaceId, userId);
        
            // Retorna sucesso com o objeto criado
            return response.status(201).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }

    public async listAllReservationsWithShifts(request: Request, response: Response): Promise<Response> {
        try {


            const output = await this.reservationService.listAllReservationsWithShifts();

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }


    public async listAllReservations(request: Request, response: Response): Promise<Response> {
        try {


            const output = await this.reservationService.listAllReservations();

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }
    
    


}
