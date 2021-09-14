require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import { createConnection, getRepository } from 'typeorm';
import { User } from './entities/user.entity';
import postRouter from './routes/post.router';
import userRouter from './routes/user.router';
import likeRouter from './routes/like.router';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bcrypt from 'bcrypt';

const ormConfig: PostgresConnectionOptions = {
    url: process.env.DATABASE_URL,
    type: 'postgres',
    entities: ['build/entities/*.js'],
    synchronize: true,
    extra: {
        ssl: {
            rejectUnauthorized: false
        }
    }
};

createConnection(ormConfig).then(() => {
    const app = express();
    app.use(express.json());
    app.use(cors());

    // Routes
    app.use('/api/users', userRouter);
    app.use('/api/posts', postRouter);
    app.use('/api/likes', likeRouter);

    app.post('/api/auth', async function (req: Request, res: Response, next: NextFunction) {
        try {
            const user = await getRepository(User).findOne({
                where: {
                    email: req.body.email
                },
                select: ['password', 'email', 'username', 'id']
            });
            const validPassword = await bcrypt.compare(req.body.password, user.password);

            if (!user || !validPassword) {
                return res.status(401).json();
            }

            const token = jwt.sign({
                userId: user.id,
                username: user.username
            }, process.env.JWT_SECRET, { expiresIn: '8h' });
            res.send({ token });
        } catch (e) {
            return next(e);
        }
    });

    app.use((_req: Request, res: Response) => {
        return res.status(404).json({ error: 'Not Found' });
    });

    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        console.error(err);
        return res.status(500).send({ error: err.message });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log('Botminder API is running on port ' + PORT);
    });
});
