import { MessageDoc } from "../interfaces/Imessage";
import Message from "../models/messageModel";

class OtpRepository {

    async findMessagesBySenderAndReceiverId(sender:string,receiver:string): Promise<MessageDoc[] | []> {
        try {
            const messageData:MessageDoc[] | [] = await Message.find({$or:[{"sender":sender,"receiver":receiver},{"sender":receiver,"receiver":sender}]}).exec();
            return messageData;
        } catch (error) {
            console.error("Error in findMessagesBySenderAndReceiverId:", error);
            throw error;
        }
    }

    async createMessage(data: MessageDoc): Promise<MessageDoc> {
        try {
            const messageModel = new Message(data);
            const savedMessage:MessageDoc = await messageModel.save();
            return savedMessage;
        } catch (error) {
            console.error("Error in createMessage:", error);
            throw error;
        }
    }
    
}

export default OtpRepository;
