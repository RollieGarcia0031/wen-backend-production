import { Request } from "express";
import { UserResponse } from "@supabase/supabase-js";

interface createProfileRequest extends Request {
    body: {
        year: string;
        department: string;
    }
    user: UserResponse['data']['user'];
}

interface   searchByInfoRequest extends Request {
    body: {
        name: string;
        day: string;
        time_start: string;
        time_end: string;
        department: string;
        year: int
    }
}

interface searchAvailabilityByIdRequest extends Request {
    body: {
        id: string
    }
}