import { PrismaClient } from "@prisma/client";
import { FindOutputDto_repository, ListRepositoryOutputDto_repository, UserRepositoryInterface, ListRepositoryOutputDtoArrayUsers_repository, UserUpdateInputDto_repository } from "../UserRepositoryInterface";
import { User } from "../../../entities/User";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extende Day.js com os plugins necessários
dayjs.extend(utc);
dayjs.extend(timezone);

export class UserRepository implements UserRepositoryInterface {

    private constructor(readonly prisma: PrismaClient) {}
    public static build(prisma: PrismaClient) {
        return new UserRepository(prisma);
    }


    
    // Save (Create)
    public async save(user: User): Promise<void> {
        try {
        // Obtém a data atual em UTC
        const createdAt = dayjs().utc().toDate(); // Obtemos a data atual no formato UTC

        await this.prisma.user.create({
            data: {
                uuid: user.getUuid(),
                name: user.getName(),
                surname: user.getSurname(),
                email: user.getEmail(),
                passwordHash: user.getPasswordHash(),
                createdAt: createdAt,
                activated: true,
                userTypeId: user.getUserTypeId(),
            },
        });
    } catch (error) {
        console.error("Error while creating reservation:", error);
        throw new Error("Erro ao criar notificação");
    }
    }

    // Find (Read)
    public async find(uuid: string): Promise<FindOutputDto_repository | null> {
        const user = await this.prisma.user.findUnique({ where: { uuid } });
        if (!user) return null;
        return {
            uuid: user.uuid,
            name: user.name,
            surname: user.surname,
            email: user.email,
            passwordHash: user.passwordHash,
            createdAt: user.createdAt,
            activated: user.activated,
            userTypeId: user.userTypeId,
        };
    }

    // List (Read)
    public async list(): Promise<ListRepositoryOutputDto_repository[]> {
        const users = await this.prisma.user.findMany({
            include: {
                userType: true, // Incluir o relacionamento com a tabela UserType
            },
        });
    
        return users.map(user => ({
            uuid: user.uuid,
            name: user.name,
            surname: user.surname,
            email: user.email,
            passwordHash: user.passwordHash,
            createdAt: user.createdAt,
            activated: user.activated,
            userTypeId: user.userTypeId,
            userType: {
                type: user.userType.typeUser, // Incluir o campo de tipo de usuário
            },
        }));
    }
    


    // ListArrayList (Read)
    public async listArrayUsers(): Promise<ListRepositoryOutputDtoArrayUsers_repository> {
        const aUsers = await this.prisma.user.findMany();

        const users = aUsers.map(user => ({
            uuid: user.uuid,
            name: user.name,
            surname: user.surname,
            email: user.email,
            passwordHash: user.passwordHash,
            createdAt: user.createdAt,
            activated: user.activated,
            userTypeId: user.userTypeId,
        }));

        return { users };
    }



    // Update
    public async update(userDto: UserUpdateInputDto_repository): Promise<void> {
        const { uuid, name, surname, email } = userDto;
        await this.prisma.user.update({
            where: { uuid },
            data: {
                name,
                surname,
                email,
            },
        });
    }

    // Delete
    public async delete(uuid: string): Promise<void> {
        await this.prisma.user.delete({
            where: { uuid },
        });
    }




}