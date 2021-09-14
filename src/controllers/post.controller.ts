import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { Like } from '../entities/like.entity';

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const qb = getRepository(Post).createQueryBuilder('post')
        .leftJoinAndSelect('post.author', 'author')
        .leftJoinAndSelect('post.likes', 'like')
        .take(+req.query.limit)
        .skip(+req.query.offset);

        if (req.query.popular === 'true') {
            const aWeekAgo = new Date();
            aWeekAgo.setDate(new Date().getDate() - 7);
            qb.where('post.createdAt >= :date', { date: aWeekAgo });
        } else {
            qb.orderBy('post.createdAt', 'DESC');
        }
        const posts = await qb.getMany();

        if (req.query.popular === 'true') {
            posts.sort((post1, post2) => post2.likesCount - post1.likesCount);
        }

        return res.json(posts);
    } catch (e) {
        return next(e);
    }
};

export const getPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await getRepository(Post).createQueryBuilder('post')
        .where({ id: req.params.id })
        .leftJoinAndSelect('post.author', 'author')
        .leftJoinAndSelect('post.likes', 'like')
        .getOne();

        return res.json(posts);
    } catch (e) {
        return next(e);
    }
};

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postRepository = getRepository(Post);
        const post = postRepository.create(({ ...req.body, author: req.user }));
        const results = await postRepository.save(post);
        return res.json(results);
    } catch (e) {
        return next(e);
    }
};

export const editPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postRepository = getRepository(Post);
        const post = await postRepository.findOne({
            where: {
                id: req.params.id
            },
            relations: ['author']
        });
        if (!post) {
            return res.status(404).json();
        }
        if (post.author.id !== req.user.id) {
            return res.status(403).json();
        }
        postRepository.merge(post, req.body);
        const results = await postRepository.save(post);
        return res.json(results);
    } catch (e) {
        return next(e);
    }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await getRepository(Post).findOne({
            where: {
                id: req.params.id
            },
            relations: ['author']
        });

        if (!post) {
            return res.status(404).json();
        }
        if (post.author.id !== req.user.id) {
            return res.status(403).json();
        }

        await getRepository(Like).delete({
            post: {
                id: post.id
            }
        });
        await getRepository(Post).delete(req.params.id);
        return res.status(204).json();
    } catch (e) {
        return next(e);
    }
};
