import projectModel from "../models/project.model";
import { ProjectData } from "../types/register.types";
import mongoose from "mongoose";

const createProject = async ({ name, userId }: ProjectData) => {
    if (!name || !userId) {
        throw new Error("Name and userId are required");
    }
    try {
        const project = await projectModel.create({ name, users: [new mongoose.Types.ObjectId(userId)] }); // users : [userId] earlier
        return project;
    } catch (error) {
        throw error;
    }
}

const getProject = async (projectId:string) => {
    if (!projectId) {
        throw new Error("ProjectId is required"); 
    }
    const project = await projectModel.findById(projectId);
    if (!project) {
        throw new Error("Project not found");
    }

// Now populate manually
const populated = await project.populate("users");
return populated;
}

export default {createProject, getProject};