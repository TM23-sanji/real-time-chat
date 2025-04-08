import express, {Request,Response} from "express";
import connect from "./db/db";
connect();

const app =express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req:Request,res:Response)=>{
    res.send('Hello World');
});

export default app;