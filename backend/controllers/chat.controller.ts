import chatModel, {IChat} from "../models/chat.models";
import {Request, Response} from "express";
import { validationResult } from "express-validator";

const createChatController = async (req: Request, res: Response):Promise<void> => {
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors.array()});
    }
    const {projectName,sender,text}=req.body;
    try {
        const chat = await chatModel.create({projectName,sender,text});
        res.status(201).json(chat);
    }
    catch (err) {
        res.status(400).json({error: "An unknown error occurred"});
    }
}

const getAllChatController = async (req: Request, res: Response):Promise<void> => {
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors.array()});
    }
    const {projectName}=req.query;
    try {
        const chats = await chatModel.find({projectName:projectName as string}, { sender: 1, text: 1, _id: 0 });
        res.status(200).json(chats);
    }
    catch (err) {
        res.status(400).json({error: "An unknown error occurred"});
    }
}

export default {createChatController, getAllChatController}; 