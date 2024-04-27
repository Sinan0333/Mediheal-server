import {Request,Response} from "express"
import MessageServices from "../services/messageServices";
import { MessageDoc } from "../interfaces/Imessage";
import { Res } from "../interfaces/Icommon";



class MessageController{
    private messageServices:MessageServices

    constructor(messageServices:MessageServices){
        this.messageServices = messageServices
    }


    async createMessage(req:Request,res:Response):Promise<void>{
        try {
            const {text,receiver,sender}:MessageDoc = req.body
            const result:Res = await this.messageServices.createMessage({sender,receiver,text})
            res.json(result)
            
        } catch (error) {
            console.error("Error in MessageController.createMessage:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async findConversationData(req:Request,res:Response):Promise<void>{
        try {
            const {sender,receiver} = req.body
            const result:Res = await this.messageServices.findConversationData(sender,receiver)
            res.json(result)
            
        } catch (error) {
            console.error("Error in MessageController.v:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}


export default MessageController