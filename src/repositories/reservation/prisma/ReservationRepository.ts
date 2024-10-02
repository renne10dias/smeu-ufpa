import { PrismaClient } from "@prisma/client";
import {
    ReservationRepositoryInterface,
} 
from "../ReservationRepositoryInterface";
import { Reservation } from "../../../entities/Reservation";


import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extende Day.js com os plugins necessários
dayjs.extend(utc);
dayjs.extend(timezone);

export class ReservationRepository implements ReservationRepositoryInterface {

    private constructor(readonly prisma: PrismaClient) {}

    // Método estático para construir o repositório
    public static build(prisma: PrismaClient) {
        return new ReservationRepository(prisma);
    }

    // Create (Save a new reservation)
    public async create(reservation: Reservation): Promise<Boolean> {
        try {
            const createdAt = dayjs().utc().toDate(); // Get current date in UTC

            await this.prisma.reservation.create({
                data: {
                    uuid: reservation.getUuid(),    // Ensure UUID is assigned
                    startDate: reservation.getStartDate(),
                    endDate: reservation.getEndDate(),
                    status: reservation.getStatus(),
                    details: reservation.getDetails(),
                    createdAt: createdAt,
                    spaceId: reservation.getSpaceId(),
                    userId: reservation.getUserId(),
                    shiftId: reservation.getShiftId(),
                },
            });

            return true; // Return true if creation is successful
        } catch (error) {
            console.error("Error while creating reservation:", error);
            return false; // Return false if an error occurs
        }
    }
}
