import {Router} from "express";
import {body, query} from "express-validator";
import chatController from "../controllers/chat.controller";

const router=Router();

router.post('/create',
    body('projectName').isString().withMessage('ProjectName is required').bail(),
    body('sender').isString().withMessage('Sender is required').bail(),
    body('text').isString().withMessage('Text is required').bail(),
    chatController.createChatController
);

router.get('/all',
    query('projectName').isString().withMessage('ProjectName is required').bail(),
    chatController.getAllChatController
)

export default router;