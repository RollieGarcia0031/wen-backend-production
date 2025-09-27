import response from "../lib/response";
import supabase from "../config/supabase";
import AppointmentService from "../services/AppointmentService";

/**
 * This can be accessed by logged user with student role to send appointments
 * to other user with professor role
 * @type { RouterHandler }
 */
export function send(req, res){

}

/**
 * It returns the list of appointments by a logged user
 * The response will vary in format depending on the role of the current user
 * - Users logged as students will be responded with their sent appointments
 * - Users logged as professor will be responded with list of received appointments  
 * @type {RouterHandler}
 */
export function getList(req, res){

}

/**
 * This is only accessible to users logged with role as a professor
 * It updates the appointment in the database, changing the field 'status' into 'confirmed' 
 * @type {RouterHandler}
 */
export function accept(req, res) {

}

/**
 * Only accessible to users logged with a student role.
 * 
 * It allows users to update the message attached to their sent appointment
 * 
 * - If the student_id of the requested appointment does not match with the uuid of
 * the logged user, it will throw an error
 * @type {RouterHandler}
 */
export function updateMessage(req, res){

}

/**
 * It deletes an appointment in the database based on the
 * requested id of appointment
 * - It throws error when the requested appointment id does not match the
 * student_id or professor_id of the logged user
 * @type {RouterHandler}
 */
export function deleteById(req, res){

}

/**
 * Returns the list of the appointments booked for the current day
 * with a status of only 'pending'
 * 
 * This will be used mainly in the dashboard to display a list of appointments
 * with corresponding names, date, and  time
 * 
 * @type {RouterHandler}
 */
export async function getCurrentlyBooked(req, res){
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
 */
export function getCountByTimeRange(req, res){
    const { timeRange } = req.body;

    const list = await
        AppointmentService.getCountByFilter(timeRange, null)
}

/** @typedef {import("../../types/RouterHandler").CustomRouterHandler} RouterHandler */