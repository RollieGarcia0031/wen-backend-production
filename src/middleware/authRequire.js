import supabase from "../config/supabase.js";
import response from "../lib/response.js";
import cookieParser from "cookie-parser";

/**
 * Used for routes that requires a logged user
 * 
 * This if for operations that will require retrieval of
 * user id, name, and other related information
 * @type {MiddlewareHandler}
 */
export async function requireAuth(req, res, next){
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return res
                .status(401)
                .json(response.create(
                    false,
                    "No access token exists",
                    null
                ));
        }

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        req.user = user; // will use later
        next();
    } catch (error) {
        return res
            .status(500)
            .json(response.create(
                false,
                "Internal error for authentication",
                null
            ));
    }
}

/**
 * @typedef {import("../../types/middlewareHandler").middlewareHandler} MiddlewareHandler
 */