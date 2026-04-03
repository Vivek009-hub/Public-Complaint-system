import Complaint from "../models/Complaint.model.js";
import { calculateSeverity } from "../services/severity.service.js";
import { createNotification } from "../services/notification.service.js";



export const createComplaint = async (req, res) => {
    try {
        const { title, description, category, lat, lng, address } = req.body;

        const imageUrls = req.files?.map(file => file.path) || [];
        // FIND NEARBY COMPLAINTS
        const nearbyComplaints = await Complaint.find({
            category,
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    $maxDistance: 500 // 500 meters
                }
            }
        });

        let duplicate = null;
        // SIMPLE TITLE MATCH
        for (let comp of nearbyComplaints) {
            if (comp.title.toLowerCase().includes(title.toLowerCase())) {
                duplicate = comp;
                break;
            }
        }


        if (duplicate) {
            duplicate.votes.push(req.user._id);

            // for severity score 
            duplicate.severityScore = calculateSeverity(duplicate);

            await duplicate.save();   // here duplicate is not model , here model is reffered to a individual complaint

            await createNotification(
                req.user._id,
                "You supported an existing complaint",
                "complaint"
            );

            return res.json({
                message: "Duplicate complaint found , supported existed one",
                complaint: duplicate
            });
        }

        // CREATE NEW COMPLAINT
        const complaint = await Complaint.create({
            title,
            description,
            category,
            images: imageUrls, // 📸 ADD THIS LINE
            location: {
                type: "Point",
                coordinates: [lng, lat],
                address
            },
            createdBy: req.user._id
        });

        // severity score 
        complaint.severityScore = calculateSeverity(complaint);
        await complaint.save();

        // 🔔 ADD THIS HERE
        await createNotification(
            req.user._id,
            "Your complaint has been submitted",
            "complaint"
        );

        res.status(201).json({
            message: "Complaint created",
            complaint
        })
    } catch (error) {
        res.status(500).json({ message: "Create complaint error" })
    }
}

// GET ALL COMPLAINTS 

export const getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 })


        res.json(complaints)
    } catch (error) {
        res.status(500).json({ message: "get Complaints error" })
    }
}

// GET SINGLE COMPLAINT
export const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate("createdBy", "name email");

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" })
        }

        res.json(complaint);
    } catch (error) {
        res.status(500).json({ message: "GetComplaintById error" })
    }
}

export const voteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(400).json({ message: "Complaint not found" });
        }
        const userId = req.user._id;

        if (complaint.votes.includes(userId)) {
            return res.status(400).json({ message: "Already Suppported" })
        };

        complaint.votes.push(userId);

        await complaint.save();

        await createNotification(
            userId,
            "You supported a complaint",
            "complaint"
        );

        res.json({
            message: "Complaint Supported",
            votes: complaint.votes.length
        })
    } catch (error) {
        res.status(500).json({ message: "voteComplaint Error " })
    }
}

// 🗺️ HEATMAP DATA
export const getHeatmapData = async (req, res) => {
    try {
        const data = await Complaint.aggregate([
            {
                $match: { status: { $ne: "Resolved" } }
            },
            {
                $group: {
                    _id: "$location.coordinates",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};