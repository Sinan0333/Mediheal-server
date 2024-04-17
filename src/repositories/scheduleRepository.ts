import { ObjectId } from "mongoose";
import { ScheduleDoc } from "../interfaces/Ischedule";
import Schedule from "../models/scheduleModel";

class ScheduleRepository {

    async createSchedule(data: ScheduleDoc): Promise<ScheduleDoc> {
        try {
            const scheduleModel = new Schedule(data);
            const savedSchedule = await scheduleModel.save();
            return savedSchedule;
        } catch (error) {
            console.error("Error creating schedule:", error);
            throw error;
        }
    }

    async findScheduleAndUpdate(_id:ObjectId | undefined,data: ScheduleDoc): Promise<ScheduleDoc | null> {
        try {
            const scheduleData = await Schedule.findOneAndUpdate({_id},data,{new:true})
            return scheduleData;
        } catch (error) {
            console.error("Error in findScheduleAndUpdate", error);
            throw error;
        }
    }

    async changeScheduleIsReserved(_id:string ,day:string,slot_id:string | undefined): Promise<ScheduleDoc | null> {
        try {
            const scheduleData = await Schedule.findOneAndUpdate(
                {_id, [`${day}._id`]: slot_id }, 
                { $set: { [`${day}.$.isReserved`]: true } }, 
                { new: true }
            );
            return scheduleData;
        } catch (error) {
            console.error("Error in changeScheduleIsReserved", error);
            throw error;
        }
    }

    async changeAScheduleBreak(_id:string ,day:string,slot_id:string | undefined): Promise<ScheduleDoc | null> {
        try {
            const scheduleData = await Schedule.findOneAndUpdate(
                {_id, [`${day}._id`]: slot_id }, 
                { $set: { [`${day}.$.break`]: true } }, 
                { new: true }
            );
            return scheduleData;
        } catch (error) {
            console.error("Error in changeScheduleIsReserved", error);
            throw error;
        }
    }

}

export default ScheduleRepository;
