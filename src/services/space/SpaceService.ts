import { Space } from "../../entities/Space";
import { 
    FindOutputDto_repository, 
    ListOutputDto_repository, 
    SpaceRepositoryInterface, 
    UpdateInputDto_repository 
} 
from "../../repositories/spaces/SpaceRepositoryInterface";


import { 
    CreateOutputDto_Service, 
    FindOutputDto_Service, 
    ListOutputDto_Service, 
    SpaceServiceInterface, 
    UpdateInputDto_Service 
} 
from "../../services/space/SpaceServiceInterface";

import { SpaceRepository } from "../../repositories/spaces/prisma/SpaceRepository";
import crypto from "crypto";  // Importar biblioteca para gerar UUID

export class SpaceService implements SpaceServiceInterface {

    private constructor(readonly repository: SpaceRepository) {}

    // Método estático para construir o serviço
    public static build(repository: SpaceRepository) {
        return new SpaceService(repository);
    }

    /*
        A UUID deve ser gerada no serviço por razões semelhantes às da hash da senha.
        A geração de UUIDs é uma preocupação de aplicação, não de domínio.
    */




    public async create(space: Space, filePath: string): Promise<CreateOutputDto_Service> {
        const uuid = crypto.randomUUID();  // Gera um UUID único
        
        space.setUuid(uuid);
        space.setActivityStatus(true);

        //console.log(space);

        try {
            await this.repository.create(space, uuid);  // Cria a notificação no repositório
            return { 
                uuid: space.getUuid() as string 
            };  // Retorna o UUID criado


        } catch (error) {
            console.error('Erro ao criar espaço:', error);
            throw new Error("Erro ao criar espaço");
        }
    }

   


    public async listSpacesWithFiles() {
        try {
            const reservations = await this.repository.listSpacesWithFiles();

            // Se necessário, você pode realizar mais lógica de negócios aqui
            return reservations;

        } catch (error) {
            console.error('Erro ao buscar reserva com turno no serviço:', error);
            throw new Error('Erro ao buscar reserva no serviço');
        }
    }

    public async find(uuid: string): Promise<FindOutputDto_Service | null> {
        try {
            const space = await this.repository.find(uuid);
            if (!space) {
                return null;
            }
            return this.mapToFindOutputDto(space);
        } catch (error) {
            throw new Error("Erro ao buscar notificação");
        }
    }

    

    public async list(): Promise<ListOutputDto_Service[]> {
        try {
            const spaces = await this.repository.list();
            return spaces.map(this.mapToListOutputDto);
        } catch (error) {
            console.error('Erro:', error);
            throw new Error("Erro ao listar notificações");
        }
    }


    public async update(spaceDto: UpdateInputDto_Service): Promise<void> {
        try {
            await this.repository.update({
                uuid: spaceDto.uuid,
                name: spaceDto.name,
                location: spaceDto.location,
                capacity: spaceDto.capacity,
                type: spaceDto.type,
                equipment: spaceDto.equipment,
                activityStatus: spaceDto.activityStatus,
            });
        } catch (error) {
            console.error('Erro:', error);
            throw new Error("Erro ao atualizar notificação");
        }
    }

    // Deleta uma notificação pelo UUID
    public async delete(uuid: string): Promise<void> {
        try {
            await this.repository.delete(uuid);
        } catch (error) {
            console.error('Erro:', error);
            throw new Error("Erro ao deletar notificação");
        }
    }

    // Método privado para mapear um objeto de repositório para FindOutputDto
    private mapToFindOutputDto(space: FindOutputDto_repository): FindOutputDto_Service {
        return {
            uuid: space.uuid,
            name: space.name,
            location: space.location,
            capacity: space.capacity,
            type: space.type,
            equipment: space.equipment,
            activityStatus: space.activityStatus,
        };
    }

    // Método privado para mapear um objeto de repositório para ListOutputDto
    private mapToListOutputDto(space: ListOutputDto_repository): ListOutputDto_Service {
        return {
            uuid: space.uuid,
            name: space.name,
            location: space.location,
            capacity: space.capacity,
            type: space.type,
            equipment: space.equipment,
            activityStatus: space.activityStatus,
        };
    }
}
