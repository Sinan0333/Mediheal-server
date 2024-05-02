import {Request,Response} from "express"
import PrescriptionServices from "../services/prescriptionServices";
import { PrescriptionDoc } from '../interfaces/IPrescription';
import { Res } from '../interfaces/Icommon';


class PrescriptionController{
    private prescriptionServices:PrescriptionServices

    constructor(prescriptionServices:PrescriptionServices){
        this.prescriptionServices = prescriptionServices
    }

    async getPrescriptionData(req:Request,res:Response):Promise<void>{
        try {
            
            const {_id} = req.params
            const result: Res | null = await this.prescriptionServices.getPrescriptionData(_id)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in PrescriptionController.getPrescriptionData", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async createPrescription(req:Request,res:Response):Promise<void>{
        try {
            
            const {patient,appointment,doctor,weight,height,bloodPressure,bodyTemperature,diagnosis,medicines}:PrescriptionDoc = req.body
            const result: Res | null = await this.prescriptionServices.createPrescription({patient,appointment,doctor,weight,height,bloodPressure,bodyTemperature,diagnosis,medicines})  

            if(result.status){
                res.redirect(`/doctor/appointment/change_status?_id=${appointment}&status=Checked`)
            }
            
        } catch (error) {
            console.error("Error in PrescriptionController.createPrescription:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async getPatientPrescriptions(req:Request,res:Response):Promise<void>{
        try {
            
            const {_id} = req.params
            const result: Res | null = await this.prescriptionServices.getPatientPrescriptions(_id)  
            res.json(result)
            
        } catch (error) {
            console.error("Error in PrescriptionController.getPatientPrescriptions", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

}


export default PrescriptionController