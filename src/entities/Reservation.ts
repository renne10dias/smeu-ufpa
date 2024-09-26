export class Reservation {
    private uuid: string;
    private startDate: Date;
    private endDate: Date;
    private status: string;
    private details: string | null;
    private createdAt: Date;
    private spaceId: string;
    private userId: string;
    private shiftId: string;

    constructor(
        uuid: string,
        startDate: Date,
        endDate: Date,
        status: string,
        details: string | null,
        createdAt: Date,
        spaceId: string,
        userId: string,
        shiftId: string
    ) {
        this.uuid = uuid;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.details = details;
        this.createdAt = createdAt;
        this.spaceId = spaceId;
        this.userId = userId;
        this.shiftId = shiftId;
    }

    // Getters
    public getUuid(): string {
        return this.uuid;
    }

    public getStartDate(): Date {
        return this.startDate;
    }

    public getEndDate(): Date {
        return this.endDate;
    }

    public getStatus(): string {
        return this.status;
    }

    public getDetails(): string | null {
        return this.details;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getSpaceId(): string {
        return this.spaceId;
    }

    public getUserId(): string {
        return this.userId;
    }

    public getShiftId(): string {
        return this.shiftId;
    }

    // Setters
    public setStartDate(value: Date): void {
        this.startDate = value;
    }

    public setEndDate(value: Date): void {
        this.endDate = value;
    }

    public setStatus(value: string): void {
        this.status = value;
    }

    public setDetails(value: string | null): void {
        this.details = value;
    }

    public setSpaceId(value: string): void {
        this.spaceId = value;
    }

    public setUserId(value: string): void {
        this.userId = value;
    }

    public setShiftId(value: string): void {
        this.shiftId = value;
    }
}
