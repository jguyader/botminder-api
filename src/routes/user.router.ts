import { Router } from 'express';
import { authenticateJWT } from '../services/auth.service';
import * as userController from '../controllers/user.controller';

const userRouter = Router();

userRouter.get('/profile', authenticateJWT, userController.getProfile);
userRouter.post('/', userController.postUser);
userRouter.delete('/soft', authenticateJWT, userController.softDelete);
userRouter.delete('/hard', authenticateJWT, userController.hardDelete);

export default userRouter;
