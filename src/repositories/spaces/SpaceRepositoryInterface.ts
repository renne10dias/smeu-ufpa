import { Space } from "../../entities/Space";

export type CreateOutputDto_repository = {
    uuid: string;
};

export type FindOutputDto_repository = {
    uuid: string;
    name: string;
    location: string;
    capacity: number;
    type: string;
    equipment: string;
    activityStatus: boolean; 
};

export type ListOutputDto_repository = {
    uuid: string;
    name: string;
    location: string;
    capacity: number;
    type: string;
    equipment: string;
    activityStatus: boolean; 
};


export type UpdateInputDto_repository = {
    uuid: string;
    name: string;
    location: string;
    capacity: number;
    type: string;
    equipment: string;
    activityStatus: boolean; 
};



export interface SpaceRepositoryInterface {
    create(space: Space): Promise<void>;
    find(id: string): Promise<FindOutputDto_repository | null>;
    list(): Promise<ListOutputDto_repository[]>;
    update(spaceDto: UpdateInputDto_repository): Promise<void>;
    delete(id: string): Promise<void>;

}