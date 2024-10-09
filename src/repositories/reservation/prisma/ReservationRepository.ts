import { PrismaClient } from "@prisma/client";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { subMinutes, isBefore } from 'date-fns'; // Biblioteca de manipulação de datas


import { ReservationRepositoryInterface, 
         getReservationWithShiftRepositoryOutputDto, 
         getReservation_existsOutputDto, 
         getReservationRepositoryOutputDto,
         getReservationDetails,
         getReservationOutput,
         checkStatusRevervaUpdateTime
        } from "../ReservationRepositoryInterface";


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
            // Convertendo as datas recebidas para UTC
            //const startDateUTC = dayjs(reservation.getStartDate()).utc().toDate();
            //const endDateUTC = dayjs(reservation.getEndDate()).utc().toDate();

            // Converte as datas em UTC, garantindo precisão nos fusos horários
            //const start = dayjs.utc(reservation.getStartDate()).tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ssZ');
            //const end = dayjs.utc(reservation.getEndDate()).tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ssZ');

            const createdAtUTC = dayjs(reservation.getCreatedAt()).utc().toDate();
            

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
                        createdAt: createdAtUTC,
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



     // MÉTODO PARA VERIFICAR SE JÁ PASSARAM CINCO MINUTOS DE UMA RESERVA
     public async listAndCheckReservations(): Promise<checkStatusRevervaUpdateTime[]> {
        const now = new Date();
        const fiveMinutesAgo = subMinutes(now, 5); // Calcula o horário de 5 minutos atrás

        // Buscar todas as reservas não confirmadas
        const reservations = await this.prisma.reservation.findMany({
            where: {
                status: 'false', // Supondo que 'pending' representa reservas não confirmadas
            },
            include: {
                user: true,
                space: true,
            },
        });

        for (const reservation of reservations) {
            // Verifica se a reserva foi criada há mais de 5 minutos
            if (isBefore(reservation.createdAt, fiveMinutesAgo)) {
                await this.prisma.reservation.delete({
                    where: { uuid: reservation.uuid },
                });
                console.log(`Reserva ID ${reservation.uuid} foi deletada por expiração.`);
            }
        }

        // Filtra e retorna as reservas válidas
        const validReservations = reservations.filter(reservation => !isBefore(reservation.createdAt, fiveMinutesAgo));
        
        return validReservations; // Retorna as reservas válidas
    }

    


    // Método para verificar se o turno já existe para uma data específica (ou intervalo de datas)
    public async checkShiftAvailability(startDate: Date, endDate: Date, shiftId: string): Promise<Boolean> {
        try {
            // Converte as datas em UTC, garantindo precisão nos fusos horários
            //const start = dayjs.utc(startDate).tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ssZ');
            //const end = dayjs.utc(endDate).tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ssZ');

            // Verifica se há algum turno reservado dentro do intervalo de datas
            const existingReservation = await this.prisma.reservationShift.findFirst({
                where: {
                    shiftId: shiftId,
                    reservation: {
                        OR: [
                            {
                                startDate: {
                                    lte: endDate, // A data inicial da reserva é antes ou igual à data final do intervalo
                                },
                                endDate: {
                                    gte: startDate, // A data final da reserva é depois ou igual à data inicial do intervalo
                                },
                            },
                        ],
                    },
                },
            });

            // Retorna false se o turno já estiver reservado, e true se estiver disponível
            return existingReservation ? false : true; 

        } catch (error) {
            console.error("Erro ao verificar disponibilidade de turno:", error);
            throw new Error('Erro ao verificar disponibilidade de turno');
        }
    }




    public async updateReservationStatus(uuid: string): Promise<boolean> {
        try {

            const newStatus = "true";
            // Update the reservation status in the database
            await this.prisma.reservation.update({
                where: {
                    uuid: uuid, // Find the reservation by UUID
                },
                data: {
                    status: newStatus, // Update the status
                },
            });
            
            return true; // Return true if the update is successful
        } catch (error) {
            console.error('Error updating reservation status:', error);
            throw new Error('Error updating reservation status');
        }
    }
    


    public async getReservationDetailsByUuid(uuid: string): Promise<getReservationDetails | null> {
        try {
            const reservation = await this.prisma.reservation.findUnique({
                where: {
                    uuid: uuid, // Search by reservation UUID
                },
                include: {
                    shifts: {
                        include: {
                            shift: true, // Include shift details
                        },
                    },
                    user: true, // Include user details
                    space: {
                        include: {
                            files: true, // Include space's files
                        },
                    },
                },
            });
    
            if (!reservation) {
                return null; // Return null if no reservation is found
            }
    
            // Map the result to match `getReservationDetails` structure
            return {
                uuid: reservation.uuid,
                startDate: reservation.startDate.toISOString(),
                endDate: reservation.endDate.toISOString(),
                status: reservation.status,
                details: reservation.details ?? '', // Handle nullable field
                createdAt: reservation.createdAt.toISOString(),
                shift: {
                    uuid: reservation.shifts[0].shift.uuid, // Assuming each reservation has one shift
                    nameShift: reservation.shifts[0].shift.nameShift,
                },
                user: {
                    uuid: reservation.user.uuid,
                    name: reservation.user.name,
                    email: reservation.user.email,
                },
                space: {
                    uuid: reservation.space.uuid,
                    name: reservation.space.name,
                    files: reservation.space.files.map((file) => ({
                        path: file.path, // Get the path from each file
                    })),
                },
            };
        } catch (error) {
            console.error('Error fetching reservation by UUID:', error);
            throw new Error('Error fetching reservation by UUID');
        }
    }

    public async getAllReservations(): Promise<getReservationOutput[]> {
        try {
            const reservations = await this.prisma.reservation.findMany({
                include: {
                    shifts: {
                        include: {
                            shift: true, // Include shift details
                        },
                    },
                    user: {
                        include: {
                            userType: true, // Include UserType details
                        },
                    },
                    space: true, // Include space details
                },
            });
    
            // Map the result to match `getReservationOutput` structure
            return reservations.map(reservation => ({
                uuid: reservation.uuid,
                status: reservation.status,
                createdAt: reservation.createdAt.toISOString(),
                user: {
                    name: reservation.user.name,
                    role: reservation.user.userType.typeUser || '', // Include user role, handle case where it may be null
                },
                space: {
                    name: reservation.space.name,
                },
            }));
        } catch (error) {
            console.error('Error listing reservations:', error);
            throw new Error('Error listing reservations');
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


    // Método para listar todas as reservas com seus turnos associados, incluindo o nome do turno
    public async listAllReservationsWithShifts(): Promise<getReservationWithShiftRepositoryOutputDto[]> {
        try {
            // Busca todas as reservas e inclui os turnos relacionados, juntamente com o nome do turno da tabela Shift
            const reservations = await this.prisma.reservation.findMany({
                include: {
                    shifts: {
                        include: {
                            shift: true, // Inclui os dados da tabela Shift
                        },
                    },
                },
            });

            // Se não houver reservas, retorna um array vazio
            if (reservations.length === 0) {
                return [];
            }

            // Mapeia o resultado para o DTO de saída
            const result: getReservationWithShiftRepositoryOutputDto[] = reservations.map(reservation => ({
                uuid: reservation.uuid,
                startDate: reservation.startDate.toISOString(),
                endDate: reservation.endDate.toISOString(),
                status: reservation.status,
                details: reservation.details || "", // Garante que o campo "details" seja uma string
                createdAt: reservation.createdAt.toISOString(),
                spaceId: reservation.spaceId,
                userId: reservation.userId,
                shiftId: reservation.shifts.length > 0 ? reservation.shifts[0].shiftId : '', // Pega o primeiro shiftId ou uma string vazia
                shift: reservation.shifts.map(shift => ({
                    uuid: shift.shiftId,
                    nameShift: shift.shift.nameShift, // Inclui o nome do turno da tabela Shift
                })),
            }));

            return result; // Retorna o array com as informações das reservas
        } catch (error) {
            console.error("Erro ao listar todas as reservas com turnos:", error);
            throw new Error('Erro ao listar reservas');
        }
    }



    public async listAllReservations(): Promise<getReservationRepositoryOutputDto[]> {
        try {
            // Busca todas as reservas e inclui os turnos relacionados, juntamente com o nome do turno da tabela Shift
            const reservations = await this.prisma.reservation.findMany({
                include: {
                    shifts: {
                        include: {
                            shift: true, // Inclui os dados da tabela Shift
                        },
                    },
                },
            });
    
            // Se não houver reservas, retorna um array vazio
            if (reservations.length === 0) {
                return [];  
            }
    
            // Mapeia o resultado para o DTO de saída
            const result: getReservationRepositoryOutputDto[] = reservations.map(reservation => ({
                uuid: reservation.uuid,
                // Converte as datas para o fuso horário de São Paulo
                startDate: reservation.startDate,
                endDate: reservation.endDate,
                details: reservation.details || "",
                status: reservation.status,
                shift: reservation.shifts.map(shift => ({
                    uuid: shift.shiftId,
                    nameShift: shift.shift.nameShift, // Inclui o nome do turno da tabela Shift
                })),
            }));
    
            return result; // Retorna o array com as informações das reservas
        } catch (error) {
            console.error("Erro ao listar todas as reservas com turnos:", error);
            throw new Error('Erro ao listar reservas');
        }
    }







    






    

}
