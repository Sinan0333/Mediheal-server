import {Schema,model} from 'mongoose'
import { PrescriptionDoc } from '../interfaces/IPrescription'


const prescriptionSchema = new Schema <PrescriptionDoc>({
   patient:{
       type:Schema.Types.ObjectId,
       ref:'Patient',
       required:true
   },
   appointment:{
       type:Schema.Types.ObjectId,
       ref:'Appointment',
       required:true
   },
   doctor:{
       type:Schema.Types.ObjectId,
       ref:'Doctor',
       required:true
   },
   weight:{
       type:Number,
       required:true
   },
   height:{
       type:Number,
       required:true
   },
   bloodPressure:{
       type:Number,
       required:true
   },
   bodyTemperature:{
       type:Number,
       required:true
   },
   diagnosis:[
       {
           name:{
               type:String,
               required:true
           },
           instruction:{
               type:String,
               required:true
           }
       }
   ],
   medicines:[
       {
           name:{
               type:String,
               required:true
           },
           type:{
               type:String,
               required:true
           },
           instruction:{
               type:String,
               required:true
           },
           days:{
               type:Number,
               required:true
           }
       }
   ]
})

export default  model<PrescriptionDoc>('Prescription',prescriptionSchema)

