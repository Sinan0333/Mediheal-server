import {Schema,model} from 'mongoose'
import { AdmitHistoryDoc } from '../interfaces/IAdmitHistory'


const admitHistorySchema = new Schema <AdmitHistoryDoc>({
    bedId:{
        type:String,
    },
    type:{
        type:String,
        required:true
    },
    charge:{
        type:Number,
        required:true
    },
    patient:{
        type:String,
        ref:'Patient',
        required:true
    },
    assignBy:{
        type:String,
        ref:'Doctor',
        required:true
    },
    assignDate:{
        type:Date,
        required:true
    },
    dischargeDate:{
        type:Date,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    total:{
        type:Number,
        required:true
    },

})

export default  model<AdmitHistoryDoc>('AdmitHistory',admitHistorySchema)

