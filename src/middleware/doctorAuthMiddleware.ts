import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const doctorAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const doctorToken = req.headers.authorization?.split(' ')[1];
    
    if (!doctorToken) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        verifyToken(doctorToken);
        next(); 
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
    return
};