import { Router } from 'express';
import { authenticateJWT } from '../services/auth.service';
import * as postController from '../controllers/post.controller';

const postRouter = Router();

postRouter.get('', authenticateJWT, postController.getPosts);
postRouter.get('/:id', authenticateJWT, postController.getPost);
postRouter.post('', authenticateJWT, postController.createPost);
postRouter.put('/:id', authenticateJWT, postController.editPost);
postRouter.delete('/:id', authenticateJWT, postController.deletePost);

export default postRouter;
