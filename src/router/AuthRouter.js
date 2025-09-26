import express from 'express';
import { login, logout, refresh, signup } from '../controller/AuthContoller';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.post('/refresh', refresh);

export default router;