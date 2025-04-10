import projectModel from "../models/project.model";
import { ProjectData } from "../types/register.types";

const createProject = async ({ name, userId }: ProjectData) => {
    if (!name || !userId) {
        throw new Error("Name and userId are required");
    }
    try {
        const project = await projectModel.create({ name, users: [userId] });
        return project;
    } catch (error) {
        throw error;
    }
}

export default {createProject};