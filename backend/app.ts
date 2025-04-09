import express, {Request,Response} from "express";
import cors from "cors";
import connect from "./db/db";
import userRoutes from "./routes/user.routes";
connect();

const app =express();
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({extended:true}));

app.get('/',(req:Request,res:Response)=>{
    res.send('Hello World');
});
app.use('/users',userRoutes);
export default app;