import Complaint from "../models/Complaint.model.js";
import {calculateSeverity} from "../services/severity.service.js"


// UPDATE STATUS
export const updateComplaintStatus = async(req,res)=>{
    try {
        const {status, note} = req.body;

        const complaint = await Complaint.findById(req.params.id);

        if(!complaint){
            return res.status(400).json({message:"Complaint not found"});
        }

        complaint.status = status;

        // NOTE UPDATE ( OPTIONAL )

        if(note){
            complaint.resolutionNote = note;
        }

        complaint.severityScore = calculateSeverity(complaint);

        await complaint.save();
    } catch (error) {
        res.status(500).json({message:"Update Complaint status error"})
    }
}