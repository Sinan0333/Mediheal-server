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

export interface FilterCondition {
    search:any
    charge:any
    filterData:any
    sortBy:any
    sortIn:any
    page:any
}