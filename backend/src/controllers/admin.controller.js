import Complaint from "../models/Complaint.model.js";
import { calculateSeverity } from "../services/severity.service.js"
import { createNotification } from "../services/notification.service.js";



// UPDATE STATUS
export const updateComplaintStatus = async (req, res) => {
    try {
        const { status, note } = req.body;

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(400).json({ message: "Complaint not found" });
        }

        complaint.status = status;

        // NOTE UPDATE ( OPTIONAL )

        if (note) {
            complaint.resolutionNote = note;
        }

        complaint.severityScore = calculateSeverity(complaint);

        await complaint.save();

        res.json({
            message: "Status updated",
            complaint
        })
    } catch (error) {
        res.status(500).json({ message: "Update Complaint status error" })
    }

}


// MARK AS RESOLVED

export const resolveComplaint = async (req, res) => {
    try {
        const { proofImage, note } = req.body;

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(400).json({ message: "Complaint not found" })
        }
        complaint.status = "Resolved";
        complaint.resolutionProof = proofImage;
        complaint.resolutionNote = note;
        complaint.resolvedBy = req.user._id;
        complaint.resolvedAt = new Date();

        await complaint.save();
        await createNotification(
            complaint.createdBy,
            "Your complaint has been resolved",
            "status"
        );

        res.json({
            message: "Complaint resolved",
            complaint
        })
    } catch (error) {
        res.status(500).json({ message: "Resolve Complaint model" })
    }
}
