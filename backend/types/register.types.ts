import { Types } from "mongoose";

export interface UserData {
    name:string;
    email:string;
    password:string;
}

export interface ProjectData {
    name:string,
    userId:string;
}