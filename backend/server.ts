import http from "http";
import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import {Server} from "socket.io";
import jwt from "jsonwebtoken";
import projectModel from "./models/project.model";
import { ObjectId } from "mongoose";

interface JwtPayload {
    id:string;
    email:string;
}

declare module "socket.io" {
    interface Socket {
      user?: {
        id: string;
        email: string;
      };
      project?: {
        name: string;
        users: ObjectId[];
        _id: string;
      };
    }
  }
  
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:'*'
    }
});

io.use(async (socket,next)=>{
    try{
        const token= socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
        const roomName= socket.handshake.query.roomName;

        if(!roomName){
            next(new Error("Room name is required"));
            return;
        }

        const project = await projectModel.findOne({ name: roomName }) as { name: string; users: ObjectId[]; _id: ObjectId } | null;
        socket.project = project
            ? {
                name: project.name,
                users: project.users.map(user => user.toString() as unknown as ObjectId),
                _id: project._id.toString(),
              }
            : undefined;

        if(!token){
            next(new Error("Unauthorized"));
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        if(!decoded){
            next(new Error("Unauthorized"));
            return;
        }
        socket.user=decoded;
        next();
    } catch(error){
        if (error instanceof Error) {
            next(new Error(error.message));
        }
    }
})

io.on('connection', socket => {
    console.log('a user connected')
    socket.join(socket.project?.name as string);
    socket.on('chat message',(msg)=>{
        console.log(msg)
        socket.broadcast.to(socket.project?.name as string).emit('chat message', msg);
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.leave(socket.project?.name as string);
    });
});

server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
