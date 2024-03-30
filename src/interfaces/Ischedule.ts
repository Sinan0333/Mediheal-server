import { ObjectId, Document } from "mongoose";

export interface ScheduleDoc extends Document {
    _id?: ObjectId;
    monday: ScheduleTime[] | [];
    tuesday: ScheduleTime[]|[];
    wednesday: ScheduleTime[] | [];
    thursday: ScheduleTime[] | [];
    friday: ScheduleTime[] | [];
    saturday: ScheduleTime[] | [];
    sunday: ScheduleTime[] | [];
} 

export interface ScheduleTime {
    startTime: string;
    endTime: string;
    break: boolean;
    isReserved: boolean;
}
