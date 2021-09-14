import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { Like } from '../entities/like.entity';

const bcrypt = require('bcrypt');

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(404).end();
        }
        return res.json(req.user);
    } catch (e) {
        return next(e);
    }
};

export const postUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userRepository = getRepository(User);
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);

        const userDb = userRepository.create(({ ...req.body, password }));
        const user = await userRepository.save(userDb);
        return res.json(user);
    } catch (e) {
        return next(e);
    }
};

export const softDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        await getRepository(Like).createQueryBuilder()
        .update()
        .set({ user: null })
        .where({
            user: {
                id: user.id
            }
        })
        .execute();

        await getRepository(Post).createQueryBuilder()
        .update()
        .set({ author: null })
        .where({
            author: {
                id: user.id
            }
        }).execute();

        await getRepository(User).remove(user);

        return res.status(204).end();
    } catch (e) {
        return next(e);
    }
};

export const hardDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        await getRepository(Like).createQueryBuilder()
        .delete()
        .where({
            user: {
                id: user.id
            }
        })
        .execute();

        await getRepository(Post).createQueryBuilder()
        .delete()
        .where({
            author: {
                id: user.id
            }
        })
        .execute();

        await getRepository(User).delete(user);

        return res.status(204).json();
    } catch (e) {
        return next(e);
    }
};
