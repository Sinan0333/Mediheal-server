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


export{
    UserData,
    ResErr
}