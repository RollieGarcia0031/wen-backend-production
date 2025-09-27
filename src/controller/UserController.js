import User from '../services/UserService.js'

/**
 * Returns the email, name, and id of the currently logged user
 * 
 * Used to display user information in profile menu
 * @type {RouterHandler}
 */
export async function getOwnInfo(req, res){
    const info = await User.getInfo();
}

/**
 * @typedef {import('../../types/RouterHandler').CustomRouterHandler} RouterHandler
 */