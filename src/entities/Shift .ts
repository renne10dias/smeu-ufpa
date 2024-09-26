export class Shift {
    private uuid: string;
    private nameShift: string;

    constructor(uuid: string, nameShift: string) {
        this.uuid = uuid;
        this.nameShift = nameShift;
    }

    // Getters
    public getUuid(): string {
        return this.uuid;
    }

    public getNameShift(): string {
        return this.nameShift;
    }

    // Setters
    public setNameShift(value: string): void {
        this.nameShift = value;
    }
}
