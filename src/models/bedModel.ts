import {Schema,model} from 'mongoose'
import { BedDoc } from '../interfaces/IBed'


const bedSchema = new Schema <BedDoc>({
    type:{
        type:String,
        required:true
    },
    charge:{
        type:Number,
        required:true
    },
    patient:{
        type:Schema.Types.ObjectId,
        ref:'Patient',
    },
    assignBy:{
        type:String
    },
    assignDate:{
        type:Date
    },
    dischargeDate:{
        type:Date
    },
    description:{
        type:String
    },
    total:{
        type:Number
    },
    available:{
        type:Boolean,
        required:true
    },
    is_blocked:{
        type:Boolean,
        required:true
    }
})

export default  model<BedDoc>('bed',bedSchema)

