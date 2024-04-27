import MessageRepository from "../repositories/messageRepositories";
import { MessageDoc } from '../interfaces/Imessage';
import { Res } from "../interfaces/Icommon";

class MessageServices {
    private messageRepo: MessageRepository;

    constructor(messageRepo: MessageRepository) {
        this.messageRepo = messageRepo;
    }

    async createMessage(data: MessageDoc): Promise<Res > {
        try {
            const messageData:MessageDoc = await this.messageRepo.createMessage(data);
            return { data: messageData, status: true, message: "Message sent successfully" };
        } catch (error) {
            console.error("Error in createMessage:", error);
            throw error;
        }
    }

    async findConversationData(sender:string,receiver:string): Promise<Res > {
        try {
            const messageData:MessageDoc[] | [] = await this.messageRepo.findMessagesBySenderAndReceiverId(sender,receiver);
            return { data: messageData, status: true, message: "Message sent successfully" };
        } catch (error) {
            console.error("Error in findConversationData:", error);
            throw error;
        }
    }
}

export default MessageServices;
