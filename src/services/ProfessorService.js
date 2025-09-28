import response from "../lib/response";


/**
 * It checks if the passed role is valid as a professor
 * 
 * Mismatch in the role will automatically generate an error response to the
 * client
 * 
 * @param {import('express').Response} res 
 * @param {import("../../types/UserRole").UserRole} role
 * @returns {boolean}
 */
export function isProfessor(res, role){
    if (role == 'professor'){
        return true;
    }

    res
        .status(401)
        .json( response.create(
            false,
            'User not logged with appropriate role',
            null
        ));

    return false;
}