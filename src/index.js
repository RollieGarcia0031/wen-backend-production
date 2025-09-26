import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || process.env.LOCAL_PORT;
const app = express();

/*       APP ROUTES       */

app.get('/', (req, res)=>{
    res.send('get req');
});
// app.post();


app.listen(port, ()=>console.log(`listening: \thttp://localhost:${port}`));