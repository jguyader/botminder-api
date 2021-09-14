import { getRepository } from 'typeorm';
import { User }          from '../entities/user.entity';

const jwt = require('jsonwebtoken');

export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        const accessTokenSecret = process.env.JWT_SECRET;
        jwt.verify(token, accessTokenSecret, async (err, userInfo) => {
            if (err) {
                return res.status(403).end();
            }

            req.user = await getRepository(User).findOne({id : userInfo.userId });
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
