export class Notification {
    private uuid?: string; // Parâmetro opcional deve ser colocado após os obrigatórios
    private type: string;
    private sendDate: Date;
    private status: string;

    constructor(type: string, sendDate: Date, status: string, uuid?: string) {
        this.type = type;
        this.sendDate = sendDate;
        this.status = status;
        this.uuid = uuid;
    }

    // Getters
    public getUuid(): string | undefined {
        return this.uuid;
    }

    public getType(): string {
        return this.type;
    }

    public getSendDate(): Date {
        return this.sendDate;
    }

    public getStatus(): string {
        return this.status;
    }

    // Setters
    public setUuid(uuid: string): void {
        this.uuid = uuid;
    }

    public setType(value: string): void {
        this.type = value;
    }

    public setSendDate(value: Date): void {
        this.sendDate = value;
    }

    public setStatus(value: string): void {
        this.status = value;
    }
}
