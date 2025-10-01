import supabase from '../config/supabase.js';
import response from '../lib/response.js';
import { isProfessor } from '../services/ProfessorService.js';

/**
 * Allows users logged as professors to create a new profile
 * that would represent the year and course that they are currently
 * teaching
 * 
 * Each teacher can have multiple profiles, if they teach more than one
 * section
 * @param {import('../../types/ProfessorController.d.ts').createProfileRequest} req
 * @param {import('express').Response} res
 */
export async function createProfile(req, res){
    const { department, year } = req.body;
    const { id } = req.user;
    const role = req.user.user_metadata?.role || '';
    
    if (role !== 'professor'){
        res.status(401).json( response.create(
            false,
            "User not logged with appropriate role",
            null
        ));
    }

    try {
        const { data, error } = await supabase
            .from('professors')
            .insert([{
                user_id: id,
                department,
                year
            }])
        .select();
    
        if (error) throw error;
    
        res.status(200).json(response.create(
            true,
            "Created Successfully",
            data[0]
        ));
    } catch (e){
        res.status(500).json( response.create(
            false,
            e.message || "Internal server error",
            null
        ));
    }

}

/**
 * Retrieves the saved profile of the user logged with a role of professor
 * 
 * @type {RouterHandler}
 */
export async function getProfile(req, res){
    const { id } = req.user;
    const role = req.user.user_metadata?.role || '';

    const userIsProfessor = isProfessor(res, role);

    if (!userIsProfessor) return; 

    try {
        const { data, error } = await supabase
            .from('professors')
            .select('department, year, id')
            .eq('user_id', id)
        ;

        if (error) throw error;

        res.status(200).json(response.create(
            true,
            "Retrieved Success",
            data
        ))

    } catch (e) {
        res.status(500).json(response.create(false, e.message, null));
    }

}

/**
 * 
 * Deletes a specicif profile of the logged user with a role of professor
 * 
 * - Only allowed to users logged with a role as a professor
 * 
 * @type {RouterHandler} 
 */
export const deleteProfile = async (req, res)=>{
    const { id } = req.body;
    const user_id = req.user.id;
    const role = req.user.user_metadata?.role || '';

    if ( !isProfessor(res, role) ) return;

    try {
        const { data, error } = await supabase.from('professors')
            .delete()
            .eq('id', id)
            .eq('user_id', user_id)
            .select("id")
        ;

        if (error) throw error;

        if (data?.length === 0) {
            res.status(203).json( response.create(
                false,
                "Nothing to remove",
                null
            ))
        }

        res.status(200).json( response.create(
            true,
            "Profile removed successfully",
            data
        ));

    } catch (e){
        res.status(500).json(response.create(false, e.message, null) );
    }
}

/**
 * Used to create and save new availability for a current user
 * 
 * - Only allowed to users logged with a role as a professor
 * 
 * @param {*} req 
 * @type {RouterHandler} 
 */
export async function createAvailability(req, res){
    const { day, start, end } = req.body;
    const { id } = req.user;
    const role = req.user.user_metadata?.role || '';

    const userIsProfessor = isProfessor(res, role);

    if (!userIsProfessor) return; 

    try {
        const { data, error } = await supabase.from('availability')
            .insert([{
                user_id: id,
                day_of_week: day,
                start_time: start,
                end_time: end
            }])
            .select('id')
        ;

        if (error) throw error;

        res.status(201).json( response.create(
            true,
            "Availability added successfully",
            {
                id: data[0]
            }
        ) );

    } catch (e) {
        res.status(500).json( response.create(false, e.message, null) )
    }
}

/**
 * Returns a list of availability of the logged user
 * 
 * - Users logged with role 'professors' only are allowed to access this
 * 
 * @type {RouterHandler}
 */
export async function getAvailability(req, res){
    const { id, user_metadata: { role } } = req.user;

    if ( !isProfessor(res, role) ) return;

    try {
        const { data, error} = await supabase.from('availability')
            .select('id, day_of_week, start_time, end_time')
            .eq('user_id', id)
        ;

        if(error) throw error;

        res.status(200).json( response.create(
            true,
            "Query Success",
            data
        ) )
    } catch (e){
        res.status(500).json( response.create(false, e.message, null) );
    }
}

export function deleteAvailability(req, res){

}

/**
 * Returns a list of professors, along with information related to their
 * departments/course that is currently teaching
 * 
 * @type {RouterHandler}
 * @param {import('../../types/ProfessorController.d.ts').searchByInfoRequest} req
 */
export async function searchByInfo(req, res){
    const { day, department, name, time_end, time_start, year } = req.body;

    let query = supabase
    .from("professor_search")
    .select("*");

    if (name) query = query.ilike("name", `%${name}%`);
    if (day) query = query.eq("availability.day_of_week", day);
    if (time_start) query = query.lte("availability.start_time", time_start);
    if (time_end) query = query.gte("availability.end_time", time_end);
    if (department) query = query.eq("professors.department", department);
    if (year) query = query.eq("professors.year", year);
   
    try {
        const { data, error } = await query;
    
        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(203).json({ message: "no users found" });
        }
    
        data.forEach(x => {
            x.prof_ids = x.prof_ids[0];
            x.departments = x.departments[0];
            x.years = x.years[0]
        })

        return res.json(response.create(
            true,
            "Query Success",
            data
        ));

    } catch (error) {
        res.status(500).json( response.create(false, error?.message || "no message", null) );
    }


}

/**
 * Searches for a list of availabilty that a certain user has
 * @type {RouterHandler}
 * @param {import('../../types/ProfessorController.d.ts').searchAvailabilityByIdRequest} req
 */
export async function searchAvailabilityById(req, res){
    const { id } = req.body;

    try {
        const { data, error } = await supabase
            .from('availability')
            .select('*')
            .eq('user_id', id)    
        ;

        if (error) throw error;

        if (!data) return res.status(203).json(
            response.create( true, 'No availabilities found', null )
        );

        res.status(200).json(
            response.create(true, 'Query Sucess', data)
        );

    } catch (error) {
        res
            .status(500)
            .json(
                response.create(
                    false,
                    error.message || 'no message',
                    null
                )
            );
    }
}

/**
 * Searches for a user name, email, and profiles of a user logged as professor
 * 
 * This route will be used by student users to search for a profile of a certain professor
 * @type {RouterHandler}
 * @param {import('../../types/ProfessorController.d.ts').searchByIdRequest} req
 */
export async function searchById(req, res){
    const { id } = req.body;

    try {

        const { data, error } = await supabase
            .from('users')
            .select(`
                name,
                email,
                professors (
                    department,
                    year
                )
            `)
            .eq('id', id)
        ;

        if (error) throw error;

        res.json( response.create(
            true,
            "Query Success",
            data
        ));
        
    } catch (error) {
        res.status(500).json( response.create(
            false,
            error?.message || "no message",
            null
        ) )
    }
}

/**
 * @typedef {import('../../types/ProfessorController.d.ts').CustomRequest} CustomRequest
 * @typedef {import('../../types/RouterHandler.d.ts').CustomRouterHandler} RouterHandler
 */