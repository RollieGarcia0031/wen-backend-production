import express from 'express';
import { createAvailability, createProfile, deleteAvailability, deleteProfile, getAvailability, getProfile } from '../controller/ProfessorController';

const router = express.Router();

router.post('/profile', createProfile);
router.get('/profile', getProfile);
router.delete('/profile', deleteProfile);

router.post('/availability', createAvailability);
router.get('/availability', getAvailability);
router.delete('/availability', deleteAvailability);

export default router;
