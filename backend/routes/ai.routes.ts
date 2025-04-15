import {Router} from "express";
import aiController from "../controllers/ai.controller";
const router = Router();

router.get('/get-result',aiController.getResultController);


export default router;