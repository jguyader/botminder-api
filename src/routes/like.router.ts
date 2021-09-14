import { Router } from 'express';
import { authenticateJWT } from '../services/auth.service';
import * as likeController from '../controllers/like.controller';

const likeRouter = Router();

likeRouter.post('', authenticateJWT, likeController.createLike);
likeRouter.delete('/:id', authenticateJWT, likeController.deleteLike);

export default likeRouter;
