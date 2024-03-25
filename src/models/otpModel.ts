import {Schema,model} from 'mongoose'
import { OtpDoc } from '../interfaces/IOtp'


const OtpSchema = new Schema <OtpDoc>({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
})

export default  model<OtpDoc>('Otp',OtpSchema)

