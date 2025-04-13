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

router.get('/all',authMiddleware.authUser,userController.getAllUsersController);

router.post('/available-users',
    body('users').isArray({min:1}).withMessage('Users must be an array of at least 1 user').bail()
    .custom((users)=>{return users.every((user:string)=>user.match(/^[0-9a-fA-F]{24}$/))}),//check if all users are valid mongo ids.
    authMiddleware.authUser,userController.getAvailableUsersController);

export default router;