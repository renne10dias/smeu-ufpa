import { Users } from "../../entities/Users";

export type CreateOutputDto = {
    id: string;
};

export type FindOutputDto = {
    id: string;
    name: string;
    surname: string;
    email: string;
    created_at: string;
};

export type ListRepositoryOutputDto = {
    id: string;
    name: string;
    surname: string;
    email: string;
    created_at: string;
};

export type ListRepositoryOutputDtoArrayUsers = {
    users: {
        id: string;
        name: string;
        surname: string;
        email: string;
        created_at: string;
    }[];
};

export type ListUserProductRepositoryOutputDto = {
    id: string;
    name: string;
    products: {
        id: string;
        name: string;
        price: number;
        quantity: number;
    }[];
};


// userUpdateInputDto.ts

export type UserUpdateInputDto = {
    id: string;
    name: string;
    surname: string;
    email: string;
};



export interface UsersRepository {
    save(user: Users): Promise<void>;
    find(id: string): Promise<FindOutputDto | null>;
    list(): Promise<ListRepositoryOutputDto[]>;
    listArrayUsers(): Promise<ListRepositoryOutputDtoArrayUsers>;
    update(userDto: UserUpdateInputDto): Promise<void>;
    delete(id: string): Promise<void>;
    listUsersWithProducts(): Promise<ListUserProductRepositoryOutputDto[]>;
}