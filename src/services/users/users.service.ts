import { Users } from "../../entities/Users";

export type CreateOutputDto = {
    id: string;
};

export type ListServiceOutputDto = {
    id: string;
    name: string;
    surname: string;
    email: string;
    created_at: string;
};
 
export type ListServiceOutputDtoArrayUsers = {
    users: {
        id: string;
        name: string;
        surname: string;
        email: string;
        created_at: string;
    }[];
};

export type ListUserProductOutputDto = {
    users: {
        id: string;
        name: string;
        products: {
            id: string;
            name: string;
            price: number;
            quantity: number;
        }[];
    }[];
};

export interface UsersService {
    save(name: string, surname: string, email: string, password: string, user_types_id: string): Promise<CreateOutputDto>;
    find(id: string): Promise<ListServiceOutputDto | null>;
    list(): Promise<ListServiceOutputDto[]>;
    listArrayUsers(): Promise<ListServiceOutputDtoArrayUsers>;
    update(id: string, name: string, surname: string, email: string): Promise<void>;
    delete(id: string): Promise<void>;
    listUserForProduct(): Promise<ListUserProductOutputDto>;
}
