import express from 'express';
import dotenv from 'dotenv';
import AuthRouter from './router/AuthRouter.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const port = process.env.PORT || process.env.LOCAL_PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

/*       APP ROUTES       */

app.get('/', (req, res)=>{
    res.send('get req');
});

app.use('/auth', AuthRouter);

app.use('/professor', ProfessorRouter);
// app.post();


app.listen(port, ()=>console.log(`listening: \thttp://localhost:${port}`));
