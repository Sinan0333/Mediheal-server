import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const userAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const userToken = req.headers.authorization?.split(' ')[1];
    
    if (!userToken) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decodedToken = verifyToken(userToken);

        
        if (decodedToken.role !== 'user') {     
            return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
        }

        next(); 
    } catch (error:any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Unauthorized: Token expired' });
        }
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
    return
};