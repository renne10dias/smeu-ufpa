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

    // Create (Salvar uma nova notificação)
    public async create(reservation: Reservation): Promise<void> {
        try {
            const createdAt = dayjs().utc().toDate(); // Obtemos a data atual no formato UTC

            await this.prisma.reservation.create({
                data: {
                    uuid: reservation.getUuid(),    // Garante que o UUID foi atribuído no serviço
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
        } catch (error) {
            throw new Error("Erro ao criar notificação");
        }
    }

    

    
    

    
}
