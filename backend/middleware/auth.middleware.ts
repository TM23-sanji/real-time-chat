import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import redisClient from "../services/redis.service";

interface JwtPayload {
    id:string;
    email:string;
}

declare global{
    namespace Express{
        interface Request{
            user?:JwtPayload;
        }
    }
}

const authUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
        if (!token) {
            res.status(401).send("Unauthorized")
            return
        }
        const isBlackListed = await redisClient.get(token as string);
        if (isBlackListed) {
            res.cookie('token','')
            res.status(401).send("Unauthorized");
            return
        }
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = decoded;
        next();
    } catch (error){
        res.status(401).send("Unauthorized");
    }
}

export default {authUser};