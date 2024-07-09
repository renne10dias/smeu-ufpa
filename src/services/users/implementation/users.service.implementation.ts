import { Users } from "../../../entities/Users";
import { FindOutputDto, ListRepositoryOutputDtoArrayUsers, ListUserProductRepositoryOutputDto, UsersRepository, UserUpdateInputDto } from "../../../repositories/users/users.repository";


import bcrypt from "bcrypt";
import { CreateOutputDto, ListServiceOutputDto, ListServiceOutputDtoArrayUsers, ListUserProductOutputDto, UsersService } from "../users.service";

export class UsersServiceImplementation implements UsersService {

    private constructor(readonly repository: UsersRepository) {}

    public static build(repository: UsersRepository) {
        return new UsersServiceImplementation(repository);
    }

    /*
        A UUID deve ser gerada no serviço (service) por razões semelhantes às da hash da senha. A
        geração de UUIDs é uma preocupação de aplicação, não de domínio. O modelo (entidade) deve 
        focar na representação dos dados e regras de negócio da entidade, enquanto o serviço lida 
        com operações e lógica de negócios mais complexas.
    */


    // SERVICES
    public async save(name: string, surname: string, email: string, password: string, user_types_id: string): Promise<CreateOutputDto> {
        const id = crypto.randomUUID().toString();
        const password_hash = await bcrypt.hash(password, 8);
        const created_at = new Date();

        const data = Users.with(
            id, 
            name, 
            surname, 
            email, 
            password_hash, 
            created_at, 
            user_types_id
        );

        await this.repository.save(data);

        const output: CreateOutputDto = {
            id: data.id,
        };
        
        return output;
    
    }



    public async find(id: string): Promise<ListServiceOutputDto | null> {
        const user = await this.repository.find(id);
        if (!user) return null;
        return {
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            created_at: user.created_at,
        };
    }






    public async list(): Promise<ListServiceOutputDto[]> {
        const aUsers = await this.repository.list();

        // Mapeia cada objeto de ListRepositoryOutputDto para ListServiceOutputDto
        const mappedUsers: ListServiceOutputDto[] = aUsers.map(user => ({
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            created_at: user.created_at,
        }));

        return mappedUsers;
    
    }

    public async listArrayUsers(): Promise<ListServiceOutputDtoArrayUsers> {
        const repositoryResult = await this.repository.listArrayUsers();

        const users: ListServiceOutputDtoArrayUsers = {
            users: repositoryResult.users.map(user => ({
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                created_at: user.created_at,
            }))
        };

        return users;
    }

    




    public async update(id: string, name: string, surname: string, email: string): Promise<void> {
        // Verifica se o usuário existe antes de tentar atualizar
        const existingUser: FindOutputDto | null = await this.repository.find(id);
        if (!existingUser) {
            throw new Error(`User with id ${id} not found.`);
        }

        const userDto: UserUpdateInputDto = {
            id,
            name,
            surname,
            email,
        };

        // Chama o método update do repositório para realizar a atualização
        await this.repository.update(userDto);

    }



    public async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
    
    public async listUserForProduct(): Promise<ListUserProductOutputDto> {
        const usersWithProducts: ListUserProductRepositoryOutputDto[] = await this.repository.listUsersWithProducts();
        return {
            users: usersWithProducts.map(user => ({
                id: user.id,
                name: user.name,
                products: user.products.map(product => ({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity,
                })),
            })),
        };
    }

    

}