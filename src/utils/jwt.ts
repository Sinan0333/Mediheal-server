import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserDoc } from '../interfaces/IUser';
import { DoctorDoc } from '../interfaces/IDoctor';


const generateToken = (data: UserDoc | DoctorDoc): string => {
    if (!process.env.JWT_SECRET) throw new Error('JWT secret is not defined');
    const plainObject = data.toObject();
    return jwt.sign(plainObject, process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURATION });
};


const verifyToken = (token: string): JwtPayload => {
    if (!process.env.JWT_SECRET) throw new Error('JWT secret is not defined');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        
        return decoded as JwtPayload;
    } catch (error) {
        throw new Error('Token verification failed');
    }
};

export{
    generateToken,
    verifyToken
}