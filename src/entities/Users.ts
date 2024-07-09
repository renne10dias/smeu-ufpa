export type UserProps = {
    id: string;
    name: string;
    surname: string;
    email: string;
    password_hash: string;
    created_at: Date;
    user_types_id: string;
};

export class Users {
    private constructor(readonly props: UserProps) {
        this.validate();
    }
    
    public static with(id: string, name: string, surname: string, email: string, password_hash: string, created_at: Date, user_types_id: string) {
        return new Users({
            id,
            name,
            surname,
            email,
            password_hash,
            created_at,
            user_types_id
        });
    }


    
    private validate() {
        if (!this.isValidEmail(this.props.email)) {
            throw new Error('Invalid email format');
        }

        if (!this.isValidName(this.props.name)) {
            throw new Error('Invalid name');
        }

        if (!this.isValidName(this.props.surname)) {
            throw new Error('Invalid surname');
        }

        if (!this.isValidPasswordHash(this.props.password_hash)) {
            throw new Error('Invalid password hash');
        }

        if (!this.isValidUUID(this.props.id)) {
            throw new Error('Invalid UUID');
        }

        if (!this.isValidUUID(this.props.user_types_id)) {
            throw new Error('Invalid user type ID');
        }

        if (!this.isValidDate(this.props.created_at)) {
            throw new Error('Invalid creation date');
        }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private isValidName(name: string): boolean {
        return name.trim().length > 0;
    }

    private isValidPasswordHash(passwordHash: string): boolean {
        return passwordHash.length === 60; // Assuming bcrypt hash length
    }

    private isValidUUID(id: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
    }

    private isValidDate(date: Date): boolean {
        return !isNaN(date.getTime());
    }

    public get id() {
        return this.props.id;
    }

    public get name() {
        return this.props.name;
    }

    public get surname() {
        return this.props.surname;
    }

    public get email() {
        return this.props.email;
    }

    public get password_hash() {
        return this.props.password_hash;
    }

    public get created_at() {
        return this.props.created_at;
    }

    public get user_types_id() {
        return this.props.user_types_id;
    }

    public changeEmail(newEmail: string) {
        if (!this.isValidEmail(newEmail)) {
            throw new Error('Invalid email format');
        }
        this.props.email = newEmail;
    }

    public changePasswordHash(newPasswordHash: string) {
        if (!this.isValidPasswordHash(newPasswordHash)) {
            throw new Error('Invalid password hash');
        }
        this.props.password_hash = newPasswordHash;
    }

    public changeName(newName: string) {
        if (!this.isValidName(newName)) {
            throw new Error('Invalid name');
        }
        this.props.name = newName;
    }

    public changeSurname(newSurname: string) {
        if (!this.isValidName(newSurname)) {
            throw new Error('Invalid surname');
        }
        this.props.surname = newSurname;
    }
}
