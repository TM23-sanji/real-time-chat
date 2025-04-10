import projectModel from "../models/project.model";
import { ProjectData } from "../types/register.types";

const createProject = async ({ name, userId }: ProjectData) => {
    if (!name || !userId) {
        throw new Error("All fields are required");
    }
    const project = await projectModel.create({ name, users: [userId] });
    return project;
}

export default {createProject};