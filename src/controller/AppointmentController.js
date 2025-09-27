import response from "../lib/response.js";
import supabase from "../config/supabase.js";
import AppointmentService from "../services/AppointmentService.js";

/**
 * This can be accessed by logged user with student role to send appointments
 * to other user with professor role
 * @type { RouterHandler }
 * @param {import("../../types/AppointmentController.d.ts").sendRequest} req
 */
export function send(req, res){
    const { availability_id, message, prof_id, time_stamp } = req.body;

}

/**
 * It returns the list of appointments by a logged user
 * The response will vary in format depending on the role of the current user
 * - Users logged as students will be responded with their sent appointments
 * - Users logged as professor will be responded with list of received appointments  
 * @type {RouterHandler}
 * @param {import("../../types/AppointmentController.d.ts").getListRequest} req
 */
export function getList(req, res){
    const {} = req.body;
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