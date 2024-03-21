import {Schema,model} from 'mongoose'
import { IScheduleData } from '../interfaces/Ischedule'

const ScheduleItemSchema = new Schema({
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    break:{type:Boolean, required:true},
    booked:{type:Boolean, required:true}
})

const ScheduleSchema = new Schema <IScheduleData>({
    monday:[ScheduleItemSchema],
    tuesday:[ScheduleItemSchema],
    wednesday:[ScheduleItemSchema],
    thursday:[ScheduleItemSchema],
    friday:[ScheduleItemSchema],
    saturday:[ScheduleItemSchema],
    sunday:[ScheduleItemSchema]
})

export default  model<IScheduleData>('Schedule',ScheduleSchema)

