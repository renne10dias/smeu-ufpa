import { Request, Response } from "express";
import { ReservationService } from "../../../services/reservation/ReservationService";
import { Reservation } from "../../../entities/Reservation";
import Joi from 'joi';

export class ReservationController {
    private reservationService: ReservationService;

    constructor(reservationService: ReservationService) {
        this.reservationService = reservationService;
    }

    // Method to create a reservation
    public async create(request: Request, response: Response): Promise<Response> {

        const reservationSchema = Joi.object({
            startDate: Joi.date,
            endDate: Joi.date,
            status: Joi.boolean,
            details: Joi.string().required(),
            spaceId: Joi.string().required(),
            userId: Joi.string().required(),
            shiftId: Joi.string().required(),
        });

        const { error } = reservationSchema.validate(request.body);
        if (error) {
            return response.status(400).json({ error: 'Validation error: ' + error.details[0].message });
        }

        try {
            const { startDate, endDate, status, details, spaceId, userId, shiftId } = request.body;

            const reservation = new Reservation(startDate, endDate, status, details, spaceId, userId, shiftId, undefined, undefined);
            const output = await this.reservationService.create(reservation);

            return response.status(201).json({ message: "Reservation created successfully", data: output });
        } catch (error) {
            console.error("Error while creating reservation:", error);
            return response.status(500).json({ error: (error as Error).message });
        }
    }
}
