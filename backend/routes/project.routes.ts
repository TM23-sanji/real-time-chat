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

router.put('/add-user',
    body('projectName').isString().withMessage('ProjectName is required').bail(),
    body('userNames').isArray({min:1}).withMessage('UserNames must be an array of at least 1 user').bail(),
    projectController.addUserToProjectController);

router.get('/get-project/:projectId',authMiddleware.authUser,projectController.getProjectController);

export default router;