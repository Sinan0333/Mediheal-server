import { Request, Response, NextFunction } from "express";
import { verifyToken } from '../utils/jwt';

export const checkUser = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.cookies)
    const userToken: string = req.cookies['userToken'];
console.log(userToken);

    if (!userToken) {
        res.sendStatus(401); 
        return; 
    }

    const decodedToken = verifyToken(userToken);
    
    if (!decodedToken) {
        res.sendStatus(403); 
        return;
    }

    next();
};
