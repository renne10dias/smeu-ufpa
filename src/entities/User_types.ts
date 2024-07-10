export type User_typesProps = {
    id: string;
    type_user: string
};

export class User_types {

    private constructor(readonly props: User_typesProps) {}
    
    public static with(id: string, type_user: string) {
        return new User_types({
            id,
            type_user
        });

    }


    public get id() {
        return this.props.id;
    }

    public get type_user() {
        return this.props.type_user;
    }
    
}
