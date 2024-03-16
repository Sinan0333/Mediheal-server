import {Response} from 'express'
const setCookies = (res:Response,token:string   )=>{

    res.cookie('token', token, {
        httpOnly: true,
        secure: true, 
        sameSite: 'strict', 
        expires: new Date(Date.now() + 3600000), 
      })
}

export{
    setCookies
}