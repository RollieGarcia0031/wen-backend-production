import express from 'express';
import { createAvailability, createProfile, deleteAvailability, deleteProfile, getAvailability, getProfile } from '../controller/ProfessorController.js';
import { requireAuth } from '../middleware/authRequire.js';

const router = express.Router();

router.post('/profile', requireAuth, createProfile);
router.get('/profile', requireAuth, getProfile);
router.delete('/profile', requireAuth, deleteProfile);

router.post('/availability', requireAuth, createAvailability);
router.get('/availability', requireAuth, getAvailability);
router.delete('/availability', deleteAvailability);

export default router;
