import { PrismaClient } from "@prisma/client";
import { FindOutputDto, ListRepositoryOutputDto, ListRepositoryOutputDtoArrayUsers, ListUserProductRepositoryOutputDto, UsersRepository, UserUpdateInputDto } from "../users.repository";
import { Users } from "../../../entities/Users";

export class UsersRepositoryPrisma implements UsersRepository {

    private constructor(readonly prisma: PrismaClient) {}
    public static build(prisma: PrismaClient) {
        return new UsersRepositoryPrisma(prisma);
    }


    
    // Save (Create)
    public async save(user: Users): Promise<void> {
        await this.prisma.user.create({
            data: {
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                password_hash: user.password_hash,
                created_at: user.created_at,
                user_types_id: user.user_types_id,
            },
        });
    }

    // Find (Read)
    public async find(id: string): Promise<FindOutputDto | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) return null;
        return {
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            created_at: user.created_at.toISOString(),
        };
    }

    // List (Read)
    public async list(): Promise<ListRepositoryOutputDto[]> {
        const users = await this.prisma.user.findMany();
        return users.map(user => ({
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            created_at: user.created_at.toISOString(),
        }));
    }

    /*
    public async list(): Promise<ListRepositoryOutputDto[]> {
        const aUsers = await this.prisma.user.findMany();

        // Mapeia os usuários para o formato ListRepositoryOutputDto
        const users: ListRepositoryOutputDto[] = aUsers.map(user => ({
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            created_at: user.created_at.toISOString(), // Supondo que created_at é um objeto Date
        }));

        return users;
    
    }



    public async list(): Promise<ListRepositoryOutputDto[]> {
        const aUsers = await this.prisma.user.findMany();

        // Mapeia os usuários para o formato ListRepositoryOutputDto
        const users: ListRepositoryOutputDto[] = aUsers.map(user => ({
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            created_at: user.created_at.toISOString(), // Supondo que created_at é um objeto Date
        }));

        return users;
    
    }
        */




    // ListArrayList (Read)
    public async listArrayUsers(): Promise<ListRepositoryOutputDtoArrayUsers> {
        const aUsers = await this.prisma.user.findMany();

        const users = aUsers.map(user => ({
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            created_at: user.created_at.toISOString(),
        }));

        return { users };
    }

    /*
    public async listArrayUsers(): Promise<ListRepositoryOutputDtoArrayUsers> {
        const aUsers = await this.prisma.user.findMany();

        const users = aUsers.map(user => ({
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            created_at: user.created_at.toISOString(), // Supondo que created_at é um objeto Date
        }));
    

        return { users };
      
    }

    */
    



    // Update
    public async update(userDto: UserUpdateInputDto): Promise<void> {
        const { id, name, surname, email } = userDto;
        await this.prisma.user.update({
            where: { id },
            data: {
                name,
                surname,
                email,
            },
        });
    }

    // Delete
    public async delete(id: string): Promise<void> {
        await this.prisma.user.delete({
            where: { id },
        });
    }

    

    public async listUsersWithProducts(): Promise<ListUserProductRepositoryOutputDto[]> {
        const usersWithProducts = await this.prisma.user.findMany({
            include: {
                products: true, // Certifique-se de que a relação de produtos esteja configurada corretamente no Prisma
            },
        });

        return usersWithProducts.map(user => ({
            id: user.id,
            name: user.name,
            products: user.products.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: product.quantity,
            })),
        }));
    }



}