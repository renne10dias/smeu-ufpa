import { Request, Response } from "express";
import { prisma } from "../../../util/prisma.util";
import { SpaceRepository } from "../../../repositories/spaces/prisma/SpaceRepository";
import { SpaceService } from "../../../services/space/SpaceService";
import { Space } from "../../../entities/Space";

export class SpaceController {
    private spaceService: SpaceService;

    constructor(spaceService: SpaceService) {
        this.spaceService = spaceService;
    }

    // Método estático para construir o controlador
    public static build() {
        const spaceRepository = SpaceRepository.build(prisma);
        const spaceService = SpaceService.build(spaceRepository);
        return new SpaceController(spaceService);
    }

    // Método para criar uma notificação
    public async create(request: Request, response: Response): Promise<Response> {
        try {
            const { name, location, capacity, type, equipment, activityStatus } = request.body;

            // Validação de dados (pode ser feita com uma biblioteca como Joi ou class-validator)

            const space = new Space(name, location, capacity, type, activityStatus, undefined, equipment); // UUID será gerado no serviço
            const output = await this.spaceService.create(space);

            return response.status(201).json(output); // Status 201 para criação
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }


    public async find(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;

            const output = await this.spaceService.find(id)

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }



}
