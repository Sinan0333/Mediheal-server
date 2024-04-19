
export interface BedDoc {
    _id?:string
    type:string
    charge:number
    assignDate?:Date
    dischargeDate?:Date
    assignBy?:string
    patient?:string
    description?:string
    available:boolean
    total?:number
    is_blocked:Boolean
}

export interface UpdateBedDoc {
    _id?:string
    type?:string
    charge?:number
    assignDate?:Date
    dischargeDate?:Date
    assignBy?:string
    patient?:string
    description?:string
    available?:boolean
    total?:number
    is_blocked?:Boolean
}