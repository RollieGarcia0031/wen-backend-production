//@ts-check
import response from "../lib/response.js";
import supabase from "../config/supabase.js";
import AppointmentService from "../services/AppointmentService.js";
import { getRole } from "../services/UserService.js";

/**
 * This can be accessed by logged user with student role to send appointments
 * to other user with professor role
 * @type { RouterHandler }
 * @param {import("../../types/AppointmentController.d.ts").sendRequest} req
 */
export async function send(req, res){
    const { availability_id, message, prof_id, time_stamp } = req.body;
    const { id, user_metadata: { role } } = req.user;

    if (role != 'student') return res.status(403).json( response.create(
        false,
        "Only students can send appointments",
        null
    ));

    try {
        
        const requestedTargetRole = await getRole(prof_id);
        
        if (requestedTargetRole == 'student') return res
            .status(403)
            .json( response.create(
                false,
                "The requested id does not have a proper role",
                null
            ))
        ;

        const { data, error } = await supabase.from('appointments')
            .insert([{
                student_id: id,
                professor_id: prof_id,
                availability_id,
                message,
                time_stamp
            }])
            .select()
        ;

        if (error) throw error;
        
        res.status(201).json( response.create(
            true,
            "Query Sucess",
            data
        ));

    } catch (error) {
        res.status(500).json( response.create(
            false,
            error?.message || 'no message',
            null
        ))        
    }
}

/**
 * It returns the list of appointments by a logged user
 * The response will vary in format depending on the role of the current user
 * - Users logged as students will be responded with their sent appointments
 * - Users logged as professor will be responded with list of received appointments  
 * @type {RouterHandler}
 * @param {import("../../types/AppointmentController.d.ts").getListRequest} req
 */
export async function getList(req, res){
    const { id, user_metadata: { role } } = req.user;
    
    /**@type {import('../../types/AppointmentController.d.ts').aliasRelation} */
    const AliasRelation = {
        'student': 'name:users!appointments_professor_id_fkey',
        'professor': 'name:users!appointments_student_id_fkey'
    }

    try {
        const { data, error } = await supabase.from('appointments')
            .select(`
                id,
                status,
                message,
                time_stamp,
                ${AliasRelation[role]} (
                    name
                ),
                availability!appointments_availability_id_fkey (
                    day_of_week,
                    start_time,
                    end_time
                )
            `)
            .eq(
                {
                    student: 'student_id',
                    professor: 'professor_id'
                }[role]
                , id
            )
        ;

        if (error) throw error;

        const reformattedData = AppointmentService.reformatGetListSQLResponse(data); 
        console.log(reformattedData);
        res.json( response.create(
            true,
            "Query Sucess",
            {
                role,
                appointments: reformattedData
            } 
        ) )

    } catch (e) {
        res.status(500).json( response.create(
            false,
            e?.message || 'no message',
            null
        ));
    }
}

/**
 * This is only accessible to users logged with role as a professor
 * It updates the appointment in the database, changing the field 'status' into 'confirmed' 
 * @type {RouterHandler}
 * @param {import("../../types/AppointmentController.d.ts").acceptRequest} req
 */
export function accept(req, res) {
    const { id } = req.body;
}

/**
 * Only accessible to users logged with a student role.
 * 
 * It allows users to update the message attached to their sent appointment
 * 
 * - If the student_id of the requested appointment does not match with the uuid of
 * the logged user, it will throw an error
 * @type {RouterHandler}
 * @param {import("../../types/AppointmentController.d.ts").updateMessageRequest} req
 */
export function updateMessage(req, res){
    const { id, message } = req.body;

}

/**
 * It deletes an appointment in the database based on the
 * requested id of appointment
 * - It throws error when the requested appointment id does not match the
 * student_id or professor_id of the logged user
 * @type {RouterHandler}
 * @param {import("../../types/AppointmentController.d.ts").deleteByIdRequest} req
 */
export function deleteById(req, res){
    const { id } = req.body;
}

/**
 * Returns the list of the appointments booked for the current day
 * with a status of only 'pending'
 * 
 * This will be used mainly in the dashboard to display a list of appointments
 * with corresponding names, date, and  time
 * 
 * @type {RouterHandler}
 * @param {import("../../types/AppointmentController.d.ts").getCurrentlyBookedRequest} req
 */
export async function getCurrentlyBooked(req, res){
    const {} = req.body;

    const list = await
        AppointmentService.getFilteredList('today','confirmed');
    
}

/**
 * Returns a list of appointments, that can be filtered by time range
 * 
 * This will be used in dashboard to display the count of appointments,
 * categorized by the status
 * - values of time_range: 'past' | 'today' | 'tomorrow' | 'future'
 * @type {RouterHandler}
 * @param {import("../../types/AppointmentController.d.ts").getCountByTimeRangeRequest} req
 */
export async function getCountByTimeRange(req, res){
    const { time_range } = req.body;

    const list = await
        AppointmentService.getCountByFilter(time_range, null)
}

/** @typedef {import("../../types/RouterHandler").CustomRouterHandler} RouterHandler */
