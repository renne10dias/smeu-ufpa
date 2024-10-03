import { PrismaClient } from "@prisma/client";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { ReservationRepositoryInterface, getReservationWithShiftRepositoryOutputDto, getReservation_existsOutputDto } from "../ReservationRepositoryInterface";
import { Reservation } from "../../../entities/Reservation";

// Extende Day.js com os plugins necessários
dayjs.extend(utc);
dayjs.extend(timezone);

export class ReservationRepository implements ReservationRepositoryInterface {

    private constructor(readonly prisma: PrismaClient) {}

    // Método estático para construir o repositório
    public static build(prisma: PrismaClient) {
        return new ReservationRepository(prisma);
    }

    // Método para criar uma reserva e associar turnos
    public async create(reservation: Reservation): Promise<Boolean> {
        try {
            const createdAt = dayjs().utc().toDate(); // Data atual em UTC

            // Executar todas as operações dentro de uma transação
            await this.prisma.$transaction(async (prisma) => {
                // Cria a reserva
                const newReservation = await prisma.reservation.create({
                    data: {
                        uuid: reservation.getUuid(),
                        startDate: reservation.getStartDate(),
                        endDate: reservation.getEndDate(),
                        status: reservation.getStatus(),
                        details: reservation.getDetails(),
                        createdAt: createdAt,
                        spaceId: reservation.getSpaceId(),
                        userId: reservation.getUserId(),
                    },
                });

                // Cria as associações de turnos na tabela ReservationShift
                await prisma.reservationShift.createMany({
                    data: reservation.getShiftIds().map(shiftId => ({
                        reservationId: newReservation.uuid, // UUID da reserva recém-criada
                        spaceId: reservation.getSpaceId(),
                        userId: reservation.getUserId(),
                        shiftId: shiftId,
                    })),
                });
            });

            return true; // Retorna true se a criação for bem-sucedida
        } catch (error) {
            console.error("Error while creating reservation:", error);
            return false; // Retorna false se ocorrer um erro
        }
    }

    // Método para buscar uma reserva com seus turnos associados
    public async getReservationWithShift(reservationUuid: string): Promise<getReservationWithShiftRepositoryOutputDto[]> {
        try {
            const reservation = await this.prisma.reservation.findFirst({
                where: {
                    uuid: reservationUuid,
                },
                include: {
                    shifts: {
                        include: {
                            // Inclui os dados do turno que têm o nome
                            shift: true, // Verifique se você tem um relacionamento com um modelo que contém 'nameShift'
                        },
                    },
                },
            });

            // Verifica se a reserva foi encontrada
            if (!reservation) {
                return [];
            }

            // Mapeia o resultado para o DTO de saída
            const result: getReservationWithShiftRepositoryOutputDto[] = [
                {
                    uuid: reservation.uuid,
                    startDate: reservation.startDate.toISOString(),
                    endDate: reservation.endDate.toISOString(),
                    status: reservation.status,
                    details: reservation.details || "", // Garante que o campo "details" seja uma string
                    createdAt: reservation.createdAt.toISOString(),
                    spaceId: reservation.spaceId,
                    userId: reservation.userId,
                    shiftId: reservation.shifts.length > 0 ? reservation.shifts[0].shiftId : '', // Se existir um turno, obtém o primeiro UUID
                    shift: reservation.shifts.map(shift => ({
                        uuid: shift.shiftId, // Aqui deve ser o id do turno
                        nameShift: shift.shift.nameShift, // Acesse o nome do turno através do relacionamento
                    })),
                },
            ];

            return result;

        } catch (error) {
            console.error('Erro ao buscar a reserva com turno:', error);
            throw new Error('Erro ao buscar reserva');
        }
    }


    // Método para inserir um turno em uma reserva existente
    public async addShiftToReservation(reservationUuid: string, shiftId: string, spaceId: string, userId: string): Promise<Boolean> {
        try {

            // Cria o novo registro na tabela de ReservationShift
            await this.prisma.reservationShift.create({
                data: {
                    reservationId: reservationUuid, // UUID da reserva
                    shiftId: shiftId, // ID do turno
                    spaceId: spaceId, // Inclua o spaceId da reserva
                    userId: userId, // Inclua o userId da reserva
                },
            });

            return true; // Retorna true se a operação for bem-sucedida
        } catch (error) {
            console.error("Erro ao adicionar turno à reserva:", error);
            return false; // Retorna false se ocorrer um erro
        }
    }





    






    

}
