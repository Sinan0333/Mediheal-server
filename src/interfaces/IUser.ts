import {Document} from 'mongoose'

interface UserData extends Document{
    name:string
    phone:string | number
    email:string
    password:string
}


interface UserRes{
    userData?:UserData
    token?:string
    status:true | false
    message:string
}

export{
    UserData,
    UserRes
}