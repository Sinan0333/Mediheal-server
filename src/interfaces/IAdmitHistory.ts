
export interface AdmitHistoryDoc {
    _id?:string
    bedId:string
    type:string
    charge:number
    assignDate:Date
    dischargeDate:Date
    assignBy:string
    patient:string
    description:string
    total:number
}
