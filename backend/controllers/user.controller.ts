import userModel, { IUser } from "../models/user.model";
import userServices from "../services/user.service";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { UserData } from "../types/register.types";
import redisClient from "../services/redis.service";

const createUserController = async (req: Request<{}, {}, UserData>, res: Response):Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
        const user = await userServices.createUser({ name, email, password });
        const token = await user.generateJWT();
        const userObject = user.toObject();
        delete (userObject as Partial<IUser>).password;
        res.status(201).json({ user:userObject, token });
        return
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(400).send("An unknown error occurred");
        }
    }
};

const loginUserController = async (req: Request<{}, {}, UserData>, res: Response):Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({email}).select('+password') as IUser | null;
        if(!user){
            res.status(400).send("User not found");
            return;
        }
        const isValidPassword=await user.isValidPassword(password);
        if (!isValidPassword){
            res.status(400).send("Invalid password");
            return;
        }
        const token = await user.generateJWT();
        const userObject = user.toObject();
        delete (userObject as Partial<IUser>).password;
        res.status(200).json({ user:userObject, token });
        return 
    } catch(error){
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(400).send("An unknown error occurred");
        }
    }
}

const profileController= async (req:Request,res:Response):Promise<void>=>{
    const user = req.user;
    res.status(200).json({user});
}

const logoutController = async (req:Request,res:Response):Promise<void>=>{
    try {
        const token= await req.headers.authorization?.split(' ')[1] || req.cookies.token;
        if(!token){
            res.status(400).send("Token not found");
            return;
        }
        await redisClient.set(token,'logout', 'EX', 60 * 60 * 24);
        res.status(200).send("Logged out successfully");
    }
    catch (err){
        res.status(500).send("Internal Server Error");
    }
}

export default { createUserController, loginUserController, profileController, logoutController };