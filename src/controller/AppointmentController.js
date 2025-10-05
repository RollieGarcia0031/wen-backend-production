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
export async function accept(req, res) {
    const { id } = req.body;
    const user_id = req.user.id;

    /** @type {import("../../types/UserRole.js").UserRole} */
    const user_role = req.user.user_metadata.role;

    if (user_role === 'student') return res
        .status(403)
        .json(response.create(
            false,
            "User's logged as students are not allowed",
            null
        ))
    ;

    try {
        const { data, error } = await supabase
            .from('appointments')
            .update({
                status: 'confirmed'
            })
            .eq('id', id)
            .select()
        ;

        if (error) throw error;

        if (data.length === 0)return res.status(203)
            .json(response.create(
                false,
                "No rows updated",
                null
            )
        );

        res.status(200).json(response.create(
            true,
            "Updated",
            data
        ));

    } catch (error){
        res.status(500).json(response.create(
            false,
            error?.message || "no message",
            null
        ));
    }

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
export async function updateMessage(req, res){
    const { id, message } = req.body;
    const user_id = req.user.id;
    const role = req.user.user_metadata.role;

    if (role == 'professor') return res.status(401)
        .json( response.create(
            false,
            "Only students are allowed",
            null
        ))
    ;

    try {
        const { data, error } = await supabase
            .from('appointments')
            .update({ message })
            .eq('id', id)
            .eq('student_id', user_id)
            .select();
        ;

        if (error) throw error;

        if (data.length === 0)return res.status(203)
            .json( response.create(
                false,
                "No updates occurred",
                null
            ))
        ;

        res.status(200).json(response.create(
            true,
            "Updated",
            data
        ));

    } catch (error) {
        res.status(500)
            .json( response.create(false, error.message, null));
    }

}

/**
 * It deletes an appointment in the database based on the
 * requested id of appointment
 * - It throws error when the requested appointment id does not match the
 * student_id or professor_id of the logged user
 * @type {RouterHandler}
 * @param {import("../../types/AppointmentController.d.ts").deleteByIdRequest} req
 */
export async function deleteById(req, res){
    const appointment_id = req.body.id;
    const { id, user_metadata: { role } } = req.user;

    const query = supabase
        .from('appointments')
        .delete()
        .eq('id',appointment_id)
    ;

    if (role == 'professor')  query.eq('professor_id', id);
    if (role == 'student')    query.eq('student_id', id);  

    try {
        const { data, error } = await query.select(); 
        
        if (error) throw error;

        if (data?.length === 0) return res.status(203)
            .json(response.create(
                false,
                "No appointment was deleted",
                null
        ));

        res.status(200).json( response.create(
            true,
            "Appointment Deleted",
            data
        ));

    } catch (error) {
        res.status(500).json(response.create(
            false,
            error?.message || "no message",
            null
        ))
    }
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
    const { id, user_metadata: { role } } = req.user;
    
    try {
        const { data, error } = await supabase.rpc('get_todays_confirmed_appointments', {
            user_uuid: id,
            user_role: role
        })

        if (error) throw error;

        res.status(200).json(response.create(
            true,
            "Query Success",
            data
        ));

    } catch (error) {
        res.status(500).json(response.create(
            false, error.message || "no message", null
        ))
    }

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
    const userId = req.user.id;
    const role = req.user.user_metadata.role;

    let new_time_range = '';
    let startDate = '';

    if (time_range === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        startDate = tomorrow.toISOString().split('T')[0];
        new_time_range = '1 day'
    } else if (time_range == 'today') {
        new_time_range = '1 day';
        startDate = new Date().toISOString().split('T')[0];
    } else if (time_range == 'future') {
        startDate = new Date().toISOString().split('T')[0];
        new_time_range = '10 years';
    } else if (time_range == 'past') {
        startDate = '2000-01-01';
        new_time_range = '100 years';
    }
    
    try {
        const { data, error } = await supabase.rpc('get_appointments_count', {
            user_uuid: userId,
            user_role: role,
            start_date: startDate,
            time_range: new_time_range,
        });

        if (error) throw error;

        res.status(200).json(response.create(
            true,
            "Query Success",
            data
        ));

    } catch (error) {
        res.status(500).json(response.create(
            false, error.message || "no message", null
        ));
    }
}

/** @typedef {import("../../types/RouterHandler").CustomRouterHandler} RouterHandler */
