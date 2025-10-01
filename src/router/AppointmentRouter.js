import express from 'express';
import {
    accept,
    deleteById,
    getCountByTimeRange,
    getCurrentlyBooked,
    getList,
    send,
    updateMessage
} from '../controller/AppointmentController.js';
import { requireAuth } from '../middleware/authRequire.js';

const AppointmentRouter = express.Router();

AppointmentRouter.post('/send', requireAuth, send);
AppointmentRouter.get('/list', requireAuth, getList);
AppointmentRouter.post('/accept', accept);
AppointmentRouter.put('/update/message', updateMessage);
AppointmentRouter.delete('/delete', deleteById);
AppointmentRouter.get('/currentDayBooked', getCurrentlyBooked);
AppointmentRouter.post('/groupedCount', getCountByTimeRange);

export default AppointmentRouter;