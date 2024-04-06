import nodemailer from "nodemailer";

export const sendVerifyMail = async (name: string, email: string): Promise<string> => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.OTP_MAIL,
                pass: process.env.GOOGLE_APP_PASSWORD,
            },
        });

        let OTP = Math.floor(1000 + Math.random() * 9000).toString();

        const mailOptions = {
            from: process.env.OTP_MAIL,
            to: email,
            subject: "for verification mail",
            html: "<h1> Hi " + name + ",please verify your email " + OTP + "",
        };

        await transporter.sendMail(mailOptions);
        
        return OTP;

    } catch (error:any) {
        console.log(error.message);
        throw error
    }
};
