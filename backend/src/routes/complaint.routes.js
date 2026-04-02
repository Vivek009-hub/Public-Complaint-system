import express from "express";
import { createComplaint, getComplaints, voteComplaint } from "../controllers/complaint.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js"
import { getComplaintById } from "../controllers/complaint.controller.js";

const router = express.Router();


// Create Complaint (protected)
router.post("/",authMiddleware, createComplaint);

// Get all complaints (public)
router.get("/",getComplaints);
router.get("/:id", getComplaintById);
router.post("/:id/vote",authMiddleware,voteComplaint);

export default router;