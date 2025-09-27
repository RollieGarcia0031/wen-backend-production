import response from "../lib/response";
import supabase from "../config/supabase";
import AppointmentService from "../services/AppointmentService";

export function send(req, res){

}

export function getList(req, res){

}

export function accept(req, res) {

}

export function updateMessage(req, res){

}

export function deleteById(req, res){

}

export async function getCurrentlyBooked(req, res){
    const list = await
        AppointmentService.getFilteredList('today','confirmed');
    
}

export function getCountByTimeRange(req, res){
    const { timeRange } = req.body;

    const list = await
        AppointmentService.getCountByFilter(timeRange, null)
}