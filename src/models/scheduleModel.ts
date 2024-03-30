import {Schema,model} from 'mongoose'
import { ScheduleDoc } from '../interfaces/Ischedule'

const ScheduleItemSchema = new Schema({
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    break:{type:Boolean, required:true},
    isReserved:{type:Boolean, required:true}
})

const ScheduleSchema = new Schema <ScheduleDoc>({
    monday:[ScheduleItemSchema],
    tuesday:[ScheduleItemSchema],
    wednesday:[ScheduleItemSchema],
    thursday:[ScheduleItemSchema],
    friday:[ScheduleItemSchema],
    saturday:[ScheduleItemSchema],
    sunday:[ScheduleItemSchema]
})

export default  model<ScheduleDoc>('Schedule',ScheduleSchema)

