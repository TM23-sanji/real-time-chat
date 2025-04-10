import {Router} from "express";
import {body} from "express-validator";
import userController from "../controllers/user.controller";
import authMiddleware from "../middleware/auth.middleware"

const router=Router();

router.post('/register',
    body('name').isLength({min:3}).withMessage('Name must be at least 3 characters'), 
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters'),
    userController.createUserController);

router.post('/login',
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters'),
    userController.loginUserController);

router.get('/profile', authMiddleware.authUser,userController.profileController);

router.post('/logout', authMiddleware.authUser,userController.logoutController);

export default router;