import { Request } from "express";
import { UserResponse } from "@supabase/supabase-js";

interface createProfileRequest extends Request {
    body: {
        year: string;
        department: string;
    }
    user: UserResponse['data']['user'];
}
