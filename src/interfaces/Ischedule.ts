import { ObjectId, Document } from "mongoose";

export interface ScheduleDoc extends Document {
    _id?: ObjectId;
    monday: ScheduleDay[];
    tuesday: ScheduleDay[];
    wednesday: ScheduleDay[];
    thursday: ScheduleDay[];
    friday: ScheduleDay[];
    saturday: ScheduleDay[];
    sunday: ScheduleDay[];
} 

export interface ScheduleDay {
    startTime: string;
    endTime: string;
    break: boolean;
    booked: boolean;
}
