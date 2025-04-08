import http from 'http';
import dotenv from "dotenv";
dotenv.config()
import app from "./app";

const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
