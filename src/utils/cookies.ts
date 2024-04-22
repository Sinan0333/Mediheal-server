import {Response} from 'express'
const setCookies = (res:Response,token:string,name:string)=>{

    res.cookie(name, token, {
        httpOnly: true,
        secure: false, 
        sameSite: 'strict', 
        expires: new Date(Date.now() + 3600000), 
      })
}

export{
    setCookies
}