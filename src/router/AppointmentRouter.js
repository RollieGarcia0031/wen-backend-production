import express from 'express';
import {
    accept,
    deleteById,
    getCountByTimeRange,
    getCurrentlyBooked,
    getList,
    send,
    updateMessage
} from '../controller/AppointmentController';

const AppointmentRouter = express.Router();

AppointmentRouter.post('/send', send);
AppointmentRouter.get('/list', getList);
AppointmentRouter.post('/accept', accept);
AppointmentRouter.put('/update/message', updateMessage);
AppointmentRouter.delete('/delete', deleteById);
AppointmentRouter.get('/currentDayBooked', getCurrentlyBooked);
AppointmentRouter.post('/groupedCount', getCountByTimeRange);

export default AppointmentRouter;