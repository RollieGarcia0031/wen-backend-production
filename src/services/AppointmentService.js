export default class {
    
    /**
     * Queries the appointments based on the given filter
     * @param {TimeRange | null}           timeRange - past | today | tomorrow | future 
     * @param {AppointmentStatus | null}   status  - confirmed | pending
     * @param {string}                     user_id
     * @param {UserRole}                   role
    */
    static async getFilteredList(timeRange='today', status='pending', user_id, role='professor'){

    }

    /**
     * returns the data about counts of appointment assigned to/from a user
     * @param {TimeRange | null}    timeRange 
     * @param {AppointmentStatus}       status 
     * @param {string}              user_id 
     * @param {UserRole}            role 
     */
    static async getCountByFilter(timeRange, status, user_id, role){

    }

    /**
     * Reformats the object response from the sql query from
     * 
     * @param { GetListRawSQLResponse[] } data - raw data response from sql operation
     */
    static reformatGetListSQLResponse(data){
         const formattedData = data.map((info)=> {
            return {
                appointment_id: info['id'],
                status: info.status,
                message: info.message,
                time_stamp: info.time_stamp,
                name: info.name.name,
                day_of_week: info.availability.day_of_week,
                start_time: info.availability.start_time,
                end_time: info.availability.end_time
            }       
        })

        return formattedData;
    }
}

/**
 * @typedef {import('../types/TimeRange.d.ts').TimeRange} TimeRange
 * @typedef {import('../types/AppointmentStatus.d.ts').AppointmentStatus} AppointmentStatus
 * @typedef {import('../types/UserRole.d.ts').UserRole} UserRole
 */
