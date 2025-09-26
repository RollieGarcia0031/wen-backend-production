import express from 'express';
import dotenv from 'dotenv';
import AuthRouter from './router/AuthRouter.js';
dotenv.config();

const port = process.env.PORT || process.env.LOCAL_PORT;
const app = express();

/*       APP ROUTES       */

app.get('/', (req, res)=>{
    res.send('get req');
});

app.use('/auth', AuthRouter);
// app.post();


app.listen(port, ()=>console.log(`listening: \thttp://localhost:${port}`));