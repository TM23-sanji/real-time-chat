import userModel, { IUser } from "../models/user.model";
import userServices from "../services/user.service";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { UserData } from "../types/register.types";

const createUserController = async (req: Request<{}, {}, UserData>, res: Response):Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
        const user = await userServices.createUser({ name, email, password });
        const token = await user.generateJWT();
        res.status(201).json({ user, token });
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
        }
        const token = await user.generateJWT();
        res.status(200).json({ user, token });
    } catch(error){
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(400).send("An unknown error occurred");
        }
    }
}

const profileController= async (req:Request,res:Response):Promise<void>=>{
    
}

export default { createUserController, loginUserController, profileController };