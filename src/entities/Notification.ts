export class Notification {
    private uuid: string;
    private type: string;
    private sendDate: Date;
    private status: string;

    constructor(uuid: string, type: string, sendDate: Date, status: string) {
        this.uuid = uuid;
        this.type = type;
        this.sendDate = sendDate;
        this.status = status;
    }

    // Getters
    public getUuid(): string {
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
    public setUuid(value: string): void {
        this.uuid = value;
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
