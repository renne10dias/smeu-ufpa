import { Notification } from "../../../entities/Notification";
import { FindOutputDto_repository, ListOutputDto_repository, NotificationRepositoryInterface, UpdateInputDto_repository } from "../../../repositories/notification/NotificationRepositoryInterface";


import { CreateOutputDto_Service, FindOutputDto_Service, ListOutputDto_Service, NotificationServiceInterface, UpdateInputDto_Service } from "../NotificationServiceInterface";
import { NotificationRepository } from "../../../repositories/notification/prisma/NotificationRepository";

export class NotificationService implements NotificationServiceInterface {

    private constructor(readonly repository: NotificationRepository) {}
    public static build(repository: NotificationRepository) {
        return new NotificationService(repository);
    }

    /*
        A UUID deve ser gerada no serviço (service) por razões semelhantes às da hash da senha. A
        geração de UUIDs é uma preocupação de aplicação, não de domínio. O modelo (entidade) deve 
        focar na representação dos dados e regras de negócio da entidade, enquanto o serviço lida 
        com operações e lógica de negócios mais complexas.
    */


    public async create(notification: Notification): Promise<CreateOutputDto_Service> {
        const uuid = crypto.randomUUID().toString();
        const created_at = new Date();

        notification.setUuid(uuid);
        notification.setSendDate(created_at);


        await this.repository.create(notification);

        const output: CreateOutputDto_Service = {
            uuid: notification.getUuid()
        };
        
        return output;
    }

    public async find(id: string): Promise<FindOutputDto_Service | null> {
        throw new Error("Method not implemented.");
    }

    public async list(): Promise<ListOutputDto_Service[]> {
        throw new Error("Method not implemented.");
    }

    public async update(notificationDto: UpdateInputDto_Service): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    public async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    


    



    

}