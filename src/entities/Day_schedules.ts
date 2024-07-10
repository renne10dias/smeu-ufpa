export type SpacesProps = {
    id: string;
    start_time: Date;
    end_time: Date;
    booking_date: string;
    reservations_id: string;
};

export class Spaces {

    private constructor(readonly props: SpacesProps) {}
    
    public static with(id: string, start_time: Date, end_time: Date, booking_date: string, reservations_id: string) {
        return new Spaces({
            id,
            start_time,
            end_time,
            booking_date,
            reservations_id,
        });

    }


    public get id() {
        return this.props.id;
    }

    public get start_time() {
        return this.props.start_time;
    }

    public get end_time() {
        return this.props.end_time;
    }

    public get booking_date() {
        return this.props.booking_date;
    }

    public get reservations_id() {
        return this.props.reservations_id;
    }
    
}
