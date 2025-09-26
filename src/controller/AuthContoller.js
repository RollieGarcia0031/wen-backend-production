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