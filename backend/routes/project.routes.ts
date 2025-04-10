import {Router} from "express";
import {body} from "express-validator";
import projectController from "../controllers/project.controller";
import authMiddleware from "../middleware/auth.middleware";

const router =Router();

router.post('/create',
    authMiddleware.authUser,
    body('name').isString().withMessage('Name must be at least 3 characters'),
    projectController.createProjectController
);

export default router;