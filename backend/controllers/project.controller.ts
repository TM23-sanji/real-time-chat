import projectServices from "../services/project.service";
import projectModel from "../models/project.model";
import { Request, Response } from "express";
import {validationResult} from "express-validator";

const createProjectController = async (req: Request, res: Response):Promise<void> => {
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors.array()});
    }
    const {name}=req.body;
    const userId= req.user?.id;
    if (!userId || !name){
        res.status(400).send("User not found");
        return;
    }
    try {
    const newProject = await projectServices.createProject({name,userId});
    res.status(201).json(newProject);
    } catch (error) {
        res.status(400).send("An error occurred");
    }
}

export default {createProjectController};