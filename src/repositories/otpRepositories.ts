import { OtpDoc } from "../interfaces/IOtp";
import Otp from "../models/otpModel";

class OtpRepository {

    async findOtpByEmail(email: string | undefined): Promise<OtpDoc | null> {
        try {
            const otpData = await Otp.findOne({ email }).exec();
            return otpData;
        } catch (error) {
            console.error("Error in findOtpByEmail:", error);
            return null;
        }
    }

    async createOrUpdateOtp(email: string, otp: string): Promise<OtpDoc  | null> {
        try {
            const filter = { email };
            const update = { email, otp };
            const options = { upsert: true, new: true };
            const otpData = await Otp.findOneAndUpdate(filter, update, options).exec();
            return otpData
        } catch (error) {
            console.error("Error in createOrUpdateOtp:", error);
            throw error;
        }
    }
    
}

export default OtpRepository;
