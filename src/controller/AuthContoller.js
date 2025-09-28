import AuthService from "../services/AuthService.js";
import supabase from '../config/supabase.js'
import response from '../lib/response.js'

/** 
 * Used to login users
 * @type {RouterHandler}
 */
export async function login(req, res){
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({email, password});

    if (error){
        return res.status(401).json(
            response.create(false, error.message, null)
        );
    }

    AuthService.setAuthCookies(res, data.session);

    res.json(
        response.create(true, "Login Success", data.user)
    );
}

/**
 * Allows user to create an account
 * 
 * Uses supabase to handle auth
 * @type {RouterHandler}
 */
export async function signup(req, res){
    const { email, password, role, name } = req.body;
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name, role }
        }    
    });

    if (error){
        return res.status(401).json(
            response.create(false, error.message, null)
        );
    }

    const { session, user } = data;

    if (session) AuthService.setAuthCookies(res, session);

    res.json(user);
}

/**
 * Used to logout the current user, and clear the cookies of the session 
 * @type {RouterHandler}
 */
export async function logout(req, res){
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    res.json( response.create(true, "Logout Success") );
}

/** 
 * Used to refresh the tokens of user session
 * 
 * This route shall be access as primary way to handle 401 errors to allow
 * users to have a persistent authentication
 * @type {RouterHandler}
 */
export async function refresh(req, res){
    const refresh_token = req.cookies.refresh_token
    
    if (!refresh_token) return res.status(401).json({ error: 'No refresh token' })

    const { data, error } = await supabase.auth.refreshSession({ refresh_token })

    if (error) {
        return res.status(401).json(
            response.create(false, error.message, null)
        );
    }

    AuthService.setAuthCookies(res, data.session)

    res.json( response.create(true, "refresh success", data.user) );
}

/**
 * @typedef {import("../../types/RouterHandler").CustomRouterHandler} RouterHandler
 */