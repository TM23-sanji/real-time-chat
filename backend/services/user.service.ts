import userModel from "../models/user.model";
import {UserData} from "../types/register.types";

const createUser = async ({name,email,password}:UserData) => {
    if (!name || !email || !password) {
        throw new Error("All fields are required");
    }
    const hashedPassword = await userModel.hashPassword(password);
    const user = await userModel.create({name,email,password:hashedPassword});
    return user;
};

export default {createUser};