// import {ScheduleTime} from "../interfaces/Ischedule"

import { ScheduleDoc } from "../interfaces/Ischedule";



// export const geneateSlots = async (workingDays: number[]): Promise<void>=> {
//     try {
//         let slots: ScheduleTime[] = [];
//         const slotDurationInMinutes = 30; 
//         let initial = 0
//         const schedule = {
//             monday:slots,
//             tuesday:slots,
//             wednesday:slots,
//             thursday:slots,
//             friday:slots,
//             saturday:slots,
//             sunday:slots
//         }

//         // Iterate over each day between start and end date
//         let currentDate = new Date();
//         while (initial <= 6) {

//             const currentDayOfWeek = currentDate.getDay()

//             // Check if the current day is a working day for the doctor
//             if (workingDays.includes(currentDayOfWeek)) {
//                 const startTime = new Date(currentDate);
//                 const endTime = new Date(currentDate);
//                 const workingHoursStart = 9; // Example: 9:00 AM
//                 const workingHoursEnd = 17; // Example: 5:00 PM

//                 // Iterate over working hours, creating slots at regular intervals
//                 for (let hour = workingHoursStart; hour < workingHoursEnd; hour++) {
//                     startTime.setHours(hour, 0, 0, 0); // Set start time for slot
//                     endTime.setHours(hour, slotDurationInMinutes, 0, 0); // Set end time for slot
//                     slots.push({
//                         startTime,
//                         endTime,
//                         break:false,
//                         isReserved: false,
//                     });
//                 }
//                 switch (currentDayOfWeek) {
//                     case 1:
//                       schedule.monday = slots
//                       break;
//                     case 2:
//                       schedule.tuesday = slots
//                       break;
//                     case 3:
//                         schedule.wednesday = slots
//                         break;
//                     case 4:
//                         schedule.thursday = slots
//                         break;
//                     case 5:
//                         schedule.friday = slots
//                         break;
//                     case 6:
//                         schedule.saturday = slots
//                         break;
//                     case 0:
//                         schedule.sunday = slots
//                         break;
//                     default:
//                         console.log('currentDayOfWeek',currentDayOfWeek);
//                   }
//             }
//             slots=[]
//             initial++
//             currentDate.setDate(currentDate.getDate() + 1); // Move to next day
//         }
//         console.log(schedule);

//     } catch (error) {
//         console.error('Error generating slots:', error);
//         throw new Error('Failed to generate slots');
//     }
// }


function generateCustomTimeSlots(customStartTime: Date, endTime: Date, interval: number): string[] {
    const timeSlots: string[] = [];
    let currentTime = new Date(customStartTime);

    // Loop until the currentTime exceeds the endTime
    while (currentTime < endTime) {
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();

        // Format the time string
        const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

        // Add the formatted time to the timeSlots array
        timeSlots.push(formattedTime);

        // Increment the currentTime by the interval (in minutes)
        currentTime.setMinutes(currentTime.getMinutes() + interval);
    }

    return timeSlots;
}



export function generateSlots(startTime: number, endTime: number, interval: number,workingDays:number[]): any {
    const slots: any = [];
    const customStartTime = new Date();
    customStartTime.setHours(startTime, 0, 0); 
    const customEndTime = new Date();
    customEndTime.setHours(endTime, 0, 0);
    const timeSlots: string[] = generateCustomTimeSlots(customStartTime, customEndTime, interval);
    
    const schedule = {
        monday:[],
        tuesday:[],
        wednesday:[],
        thursday:[],
        friday:[],
        saturday:[],
        sunday:[]
    }

    for(let i=0;i<timeSlots.length-1;i++){
        slots.push({
            startTime:timeSlots[i],
            endTime:timeSlots[i+1],
            break:false,
            isReserved: false,
        })
    }

    for(let i=0;i<7;i++){
        if(workingDays.includes(i)){
            switch (i) {
                case 1:
                  schedule.monday = slots
                  break;
                case 2:
                  schedule.tuesday = slots
                  break;
                case 3:
                    schedule.wednesday = slots
                    break;
                case 4:
                    schedule.thursday = slots
                    break;
                case 5:
                    schedule.friday = slots
                    break;
                case 6:
                    schedule.saturday = slots
                    break;
                case 0:
                    schedule.sunday = slots
                    break;
                default:
                    console.log('currentDayOfWeek',i);
              }
        }
    }

    return schedule;
}


export function generateSlotsForADay(startTime: number, endTime: number, interval: number,day:number,schedule:ScheduleDoc): any {
    const slots: any = [];
    const customStartTime = new Date();
    customStartTime.setHours(startTime, 0, 0); 
    const customEndTime = new Date();
    customEndTime.setHours(endTime, 0, 0);
    const timeSlots: string[] = generateCustomTimeSlots(customStartTime, customEndTime, interval);

    for(let i=0;i<timeSlots.length-1;i++){
        slots.push({
            startTime:timeSlots[i],
            endTime:timeSlots[i+1],
            break:false,
            isReserved: false,
        })
    }

    switch (day) {
        case 1:
            schedule.monday = slots
            break;
        case 2:
            schedule.tuesday = slots
            break;
        case 3:
            schedule.wednesday = slots
            break;
        case 4:
            schedule.thursday = slots
            break;
        case 5:
            schedule.friday = slots
            break;
        case 6:
            schedule.saturday = slots
            break;
        case 0:
            schedule.sunday = slots
            break;
        default:
    }

    
}