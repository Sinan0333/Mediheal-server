import jwt, { JwtPayload } from 'jsonwebtoken';

const generateToken = (userId: string): string => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT secret is not defined');
    }
    return jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURATION });
};


const verifyToken = (token:string):string | JwtPayload=>{
    if(!process.env.JWT_SECRET){
        throw new Error('JWT secret is not defined');
    }
    return jwt.verify(token,process.env.JWT_SECRET)
}

export{
    generateToken,
    verifyToken
}