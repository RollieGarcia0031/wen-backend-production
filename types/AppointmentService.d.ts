interface GetListRawSQLResponse {
    id: number;
    status: string;
    message: string;
    time_stamp: string;
    name : {
        name: string
    };
    availability: {
        end_time: string;
        start_time: string;
        day_of_week: string;
    }
}
