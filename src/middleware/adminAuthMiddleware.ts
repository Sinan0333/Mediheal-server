import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const adminToken = req.headers.authorization?.split(' ')[1];
    
    if (!adminToken) {     
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decodedToken = verifyToken(adminToken);

        if (decodedToken.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
        }

        next(); 
    } catch (error:any) {
            if (error.message === 'Token expired') {  
                return res.status(401).json({ message: 'Unauthorized: Token expired' });
            }
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
    return
};