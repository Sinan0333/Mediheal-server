export interface Res{
    data?:any
    status:boolean
    message:string
}

export interface ReqParams {
    is_blocked:string
}

export interface ErrRes {
    error:string
}