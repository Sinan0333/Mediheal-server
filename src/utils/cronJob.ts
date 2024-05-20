import cron from "node-cron";
import ScheduleRepository from '../repositories/scheduleRepository';
import DoctorRepository from '../repositories/doctorRepositories';
import DoctorServices from '../services/doctorServices';

// Initialize repositories and services
const scheduleRepository = new ScheduleRepository();
const doctorRepositories = new DoctorRepository();
const doctorServices = new DoctorServices(doctorRepositories, scheduleRepository);

// Schedule the function to run every Sunday at 11:59 PM
cron.schedule('59 23 * * 0', async () => {
    try {
        console.log("Running scheduled job: updateSlots");
        await doctorServices.updateSlots();
        console.log("Scheduled job completed successfully.");
    } catch (error) {
        console.error("Error running scheduled job:", error);
    }
});

console.log("Cron job scheduled: updateSlots will run every Sunday at 11:59 PM.");
