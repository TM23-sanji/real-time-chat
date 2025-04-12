import {Router} from "express";
import {body} from "express-validator";
import projectController from "../controllers/project.controller";
import authMiddleware from "../middleware/auth.middleware";

const router =Router();

router.post('/create',
    authMiddleware.authUser,
    body('name').isString().isLength({min:3}).withMessage('Name must be at least 3 characters'),
    projectController.createProjectController
);

router.get('/all',authMiddleware.authUser,projectController.getAllProjectController);

router.put('/add-user',authMiddleware.authUser,
    body('projectId').isString().withMessage('ProjectId is required').bail(),
    body('users').isArray({min:1}).withMessage('Users must be an array of at least 1 user').bail()
    .custom((users)=>{return users.every((user:string)=>user.match(/^[0-9a-fA-F]{24}$/))}),//check if all users are valid mongo ids.
    projectController.addUserToProjectController);

router.get('/get-project/:projectId',authMiddleware.authUser,projectController.getProjectController);

export default router;