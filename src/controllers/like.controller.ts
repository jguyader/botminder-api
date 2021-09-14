import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Like } from '../entities/like.entity';

export const createLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const likeRepository = getRepository(Like);
        const like = likeRepository.create(({ post: req.body.post, user: req.user }));
        const createdLike = await likeRepository.save(like);
        return res.json(createdLike);
    } catch (e) {
        return next(e);
    }
};

export const deleteLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const like = await getRepository(Like).findOne(
            {
                where: {
                    id: req.params.id
                },
                relations: ['user']
            }
        );
        if (!like) {
            return res.status(404).json();
        }
        if (like.user.id !== req.user.id) {
            return res.status(403).json();
        }
        await getRepository(Like).delete(req.params.id);
        return res.status(204).json();
    } catch (e) {
        return next(e);
    }
};
