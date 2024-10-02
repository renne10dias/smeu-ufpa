import { User } from "../../entities/User";

export type CreateOutputDto_repository = {
    uuid: string;
};

export type FindOutputDto_repository = {
    uuid: string;
    name: string;
    surname: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    activated: boolean;
    userTypeId: string;
};

export type ListRepositoryOutputDto_repository = {
    uuid: string;
    name: string;
    surname: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    activated: boolean;
    userTypeId: string;
};

export type ListRepositoryOutputDtoArrayUsers_repository = {
    users: {
        uuid: string;
        name: string;
        surname: string;
        email: string;
        passwordHash: string;
        createdAt: Date;
        activated: boolean;
        userTypeId: string;
    }[];
};



export type UserUpdateInputDto_repository = {
    uuid: string;
    name: string;
    surname: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    activated: boolean;
    userTypeId: string;
};



export interface UserRepositoryInterface {
    save(user: User): Promise<void>;
    find(id: string): Promise<FindOutputDto_repository | null>;
    list(): Promise<ListRepositoryOutputDto_repository[]>;
    listArrayUsers(): Promise<ListRepositoryOutputDtoArrayUsers_repository>;
    update(userDto: UserUpdateInputDto_repository): Promise<void>;
    delete(id: string): Promise<void>;

}