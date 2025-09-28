import response from "../lib/response";


/**
 * 
 * @param {import('express').Response} res 
 * @param {import("../../types/UserRole").UserRole} role
 * @returns {boolean | }
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