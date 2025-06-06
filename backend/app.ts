import express, {Request,Response} from "express";
import cors from "cors";
import connect from "./db/db";
import userRoutes from "./routes/user.routes";
import projectRoutes from "./routes/project.routes";
import cookieParser from "cookie-parser";
import aiRoutes from "./routes/ai.routes";
import chatRoutes from "./routes/chat.routes";
connect();

const app =express();
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get('/',(req:Request,res:Response)=>{
    res.send('Hello World');
});
app.use('/users',userRoutes);
app.use('/projects',projectRoutes);
app.use('/ai',aiRoutes);
app.use('/chat',chatRoutes);
export default app;