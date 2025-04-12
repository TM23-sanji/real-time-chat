import projectServices from "../services/project.service";
import projectModel from "../models/project.model";
import { Request, Response } from "express";
import {validationResult} from "express-validator";
import mongoose from "mongoose";

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

const getAllProjectController = async (req: Request, res: Response):Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(400).send("User not found");
        return;
    }
    try {
        const projects = await projectModel.find({ users: userId });
        res.status(200).json(projects);
    } catch (error) {
        res.status(400).send("An error occurred");
    }
}

const addUserToProjectController = async (req: Request, res: Response):Promise<void> => {
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors.array()});
    }

    try {
        const {projectId,users}=req.body;
        if (!projectId || !users) {
            res.status(400).json({error: "ProjectId and users are required"});
            return;
        }
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            res.status(400).json({error: "Invalid ProjectId"});
            return;
        }
        const project = await projectModel.findByIdAndUpdate(projectId,{$push:{users:{$each:users}}},{new:true});
        res.status(200).json(project);

    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({error: err.message});
        } else {
            res.status(400).json({error: "An unknown error occurred"});
        }
    }
}

const getProjectController = async (req: Request, res: Response):Promise<void> => {
    const {projectId} = req.params;
    if (!projectId) {
        res.status(400).json({error: "ProjectId is required"});
        return;
    }
    try{
        const project= await projectServices.getProject(projectId);
        res.status(200).json(project);
    } catch (err) {
        console.log('Error',err)
    }
}

export default {createProjectController, getAllProjectController, addUserToProjectController, getProjectController};