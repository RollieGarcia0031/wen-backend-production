import { Request } from "express";
import { TimeRange } from "./TimeRange";

interface sendRequest extends Request {
    body: {
        /** id of the professor to recieve the appointment */
        prof_id: string;
        /** id of the availability to ensure it matches the availability of professor */
        availability_id: string;
        /** short message to be attached as header of appointment */
        message: string;
        /** exact date of the appointment to occur */
        time_stamp: string;
    }
}

interface getListRequest extends Request {
    body: null
}

interface acceptRequest extends Request {
    body: {
        /** id of the appointment to be accepted */
        id: string
    }
}

interface updateMessageRequest extends Request {
    body: {
        /** new message to be updated */
        message: string;
        /** id of the appointment to be edited */
        id: string;
    }
}

interface deleteByIdRequest extends Request {
    body: {
        /** id of the appointment to be deleted */
        id: string;
    }
}

interface getCurrentlyBookedRequest extends Request {
    body: null;
}

interface getCountByTimeRangeRequest extends Request {
    body: {
        time_range: TimeRange
    }
}