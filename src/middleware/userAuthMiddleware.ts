import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const userAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const userToken = req.headers.authorization?.split(' ')[1];
    
    if (!userToken) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        verifyToken(userToken);
        next(); 
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
    return
};