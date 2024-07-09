import { Request, Response } from "express";
import { prisma } from "../../../util/prisma.util";
import { UsersRepositoryPrisma } from "../../../repositories/users/prisma/users.repository.prisma";
import { UsersServiceImplementation } from "../../../services/users/implementation/users.service.implementation";

export class UsersController {
    private constructor() {}

    public static build() {
        return new UsersController();
        
    }


    public async create(request: Request, response: Response): Promise<Response> {
        try {
            const { name, surname, email, password, user_types_id } = request.body;

            const aRepository = UsersRepositoryPrisma.build(prisma);
            const aService = UsersServiceImplementation.build(aRepository);

            const output = await aService.save(name, surname, email, password, user_types_id);

            return response.status(201).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }


    public async find(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;

            const aRepository = UsersRepositoryPrisma.build(prisma);
            const aService = UsersServiceImplementation.build(aRepository);

            const output = await aService.find(id);

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }



    public async list(request: Request, response: Response): Promise<Response> {
        try {
            const aRepository = UsersRepositoryPrisma.build(prisma);
            const aService = UsersServiceImplementation.build(aRepository);

            const output = await aService.list();

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }


    public async listArrayUsers(request: Request, response: Response): Promise<Response> {
        try {
            const aRepository = UsersRepositoryPrisma.build(prisma);
            const aService = UsersServiceImplementation.build(aRepository);

            const output = await aService.listArrayUsers();

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }


    public async update(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;
            const { name, surname, email } = request.body;

            const aRepository = UsersRepositoryPrisma.build(prisma);
            const aService = UsersServiceImplementation.build(aRepository);

            const output = await aService.update(id, name, surname, email)

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }

    public async delete(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;

            const aRepository = UsersRepositoryPrisma.build(prisma);
            const aService = UsersServiceImplementation.build(aRepository);

            const output = await aService.delete(id);

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }


    public async listUserForProduct(request: Request, response: Response): Promise<Response> {
        try {
            const aRepository = UsersRepositoryPrisma.build(prisma);
            const aService = UsersServiceImplementation.build(aRepository);

            const output = await aService.listUserForProduct();

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }

    

    


    



    

}