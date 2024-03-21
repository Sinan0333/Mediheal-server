import { IScheduleData } from "../interfaces/Ischedule"
import Schedule from "../models/scheduleModel"

class ScheduleRepository{

    async createSchedule(data:IScheduleData):Promise<IScheduleData>{
        const scheduleModel = new Schedule(data)
        return await scheduleModel.save()
    }

}

export default ScheduleRepository