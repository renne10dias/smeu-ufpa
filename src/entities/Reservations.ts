export type ReservationProps = {
    id: string;
    start_date: Date;
    end_date: Date;
    status: string;
    details: string;
    created_at: Date;
    spaces_id: string;
    users_id: string;
};

export class Reservation {

    private constructor(readonly props: ReservationProps) {}
    
    public static with(id: string, start_date: Date, end_date: Date, status: string, details: string, created_at: Date, spaces_id: string, users_id: string) {
        return new Reservation({
            id,
            start_date,
            end_date,
            status,
            details,
            created_at,
            spaces_id,
            users_id
        });

    }


    public get id() {
        return this.props.id;
    }

    public get start_date() {
        return this.props.start_date;
    }

    public get end_date() {
        return this.props.end_date;
    }

    public get status() {
        return this.props.status;
    }

    public get details() {
        return this.props.details;
    }

    public get created_at() {
        return this.props.created_at;
    }

    public get spaces_id() {
        return this.props.spaces_id;
    }

    public get users_id() {
        return this.props.users_id;
    }
    
}
