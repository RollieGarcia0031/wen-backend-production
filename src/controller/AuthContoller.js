import AuthService from "../services/AuthService";
import supabase from '../config/supabase'
import response from '../lib/response'

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

export async function signup(req, res){
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({email, password});

    if (error){
        return res.status(401).json(
            response.create(false, error.message, null)
        );
    }

    const { session, user } = data;

    if (session) AuthService.setAuthCookies(res, session);

    res.json(user);
}

export async function logout(req, res){
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    res.json( response.create(true, "Logout Success") );
}

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