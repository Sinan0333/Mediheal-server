import { Res } from "../interfaces/Icommon";
import { ScheduleDoc } from "../interfaces/Ischedule";

export function generatePatientId(number:Number) {
    return `PAT${number.toString().padStart(2, '0')}`;
}

export function removeDays(days:number[],schedule:ScheduleDoc):Res | void{

    for(let i=0;i<days.length;i++){
        switch (days[i]) {
            case 1:
                const checkIsReserved = schedule.monday.every((doc)=>!doc.isReserved)
                if(!checkIsReserved) return {status:false,message:"Doctor is busy on this day"}
                schedule.monday = []
                break;
            case 2:
                const checkIsReserved1 = schedule.tuesday.every((doc)=>!doc.isReserved)
                if(!checkIsReserved1) return {status:false,message:"Doctor is busy on this day"}
                schedule.tuesday = []
                break;
            case 3:
                const checkIsReserved2 = schedule.wednesday.every((doc)=>!doc.isReserved)
                if(!checkIsReserved2) return {status:false,message:"Doctor is busy on this day"}
                schedule.wednesday = []
                break;
            case 4:
                const checkIsReserved3 = schedule.thursday.every((doc)=>!doc.isReserved)
                if(!checkIsReserved3) return {status:false,message:"Doctor is busy on this day"}
                schedule.thursday = []
                break;
            case 5:
                const checkIsReserved4 = schedule.friday.every((doc)=>!doc.isReserved)
                if(!checkIsReserved4) return {status:false,message:"Doctor is busy on this day"}
                schedule.friday = []
                break;
            case 6:
                const checkIsReserved5 = schedule.saturday.every((doc)=>!doc.isReserved)
                if(!checkIsReserved5) return {status:false,message:"Doctor is busy on this day"}
                schedule.saturday = []
                break;
            case 0:
                const checkIsReserved6 = schedule.sunday.every((doc)=>!doc.isReserved)
                if(!checkIsReserved6) return {status:false,message:"Doctor is busy on this day"}
                schedule.sunday = []
                break;
            default:
        }
    }
}