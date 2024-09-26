export class UserType {
    private uuid: string;
    private typeUser: string;

    constructor(uuid: string, typeUser: string) {
        this.uuid = uuid;
        this.typeUser = typeUser;
    }

    // Getters
    public getUuid(): string {
        return this.uuid;
    }

    public getTypeUser(): string {
        return this.typeUser;
    }

    // Setters
    public setTypeUser(value: string): void {
        this.typeUser = value;
    }
}
