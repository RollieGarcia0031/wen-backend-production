import express from 'express';
import { login } from '../controller/AuthContoller';

const router = express.Router();

router.post('/login', login);

export default router;