export type SpacesProps = {
    id: string;
    name: string;
    location: string;
    capacity: number;
    type: string;
    equipament: string;
    created_at: Date;
    activity_status: string;
};

export class Spaces {

    private constructor(readonly props: SpacesProps) {}
    
    public static with(id: string, name: string, location: string, capacity: number, type: string, equipament: string, created_at: Date, activity_status: string) {
        return new Spaces({
            id,
            name,
            location,
            capacity,
            type,
            equipament,
            created_at,
            activity_status
        });

    }


    public get id() {
        return this.props.id;
    }

    public get name() {
        return this.props.name;
    }

    public get location() {
        return this.props.location;
    }

    public get capacity() {
        return this.props.capacity;
    }

    public get type() {
        return this.props.type;
    }

    public get equipament() {
        return this.props.equipament;
    }

    public get created_at() {
        return this.props.created_at;
    }

    public get activity_status() {
        return this.props.activity_status;
    }
    
}
