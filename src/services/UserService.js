import supabase from "../config/supabase.js";

/**@type {UserService} */
const UserService = {
    getInfo: async (id, role)=>{
        
    }
}

export default UserService;


/**
 * 
 * It checks in the database if the given user_id is assigner with a role "professor"
 * in the role field in users table
 * 
 * @param {string} id - the user_id of the target to be verified
 * @returns {UserRole}
 */
export async function getRole(id){
    const { data, error } = await supabase
        .from('users')
        .select("role")
        .eq('id', id);

    if (error) throw error;

    const role = data[0];

    return role;
}

// DOCUMENTATION IMPORTS //
/**
 * @typedef {import("../../types/UserService").UserService} UserService
 * @typedef {import("./AppointmentService").UserRole} UserRole
 */