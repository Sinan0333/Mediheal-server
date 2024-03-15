import {Document} from 'mongoose'

interface UserData extends Document{
    name:string
    phone:string
    email:string
    password:string
}

interface ResErr{
    error:string
}

interface UserRes{
    userData?:UserData
    status:true | false
    message:string
}

export{
    UserData,
    UserRes
}