import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true,
      enum: [
        "water",
        "electricity",
        "road",
        "garbage",
        "other"
      ]
    },

    images: [
      {
        type: String // URL (Cloudinary later)
      }
    ],

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true
      },
      address: String
    },
    status: {
      type: String,
      enum: [
        "Submitted",
        "Under Review",
        "In Progress",
        "Resolved",
        "Rejected"
      ],
      default: "Submitted"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    votes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    severityScore: {
      type: Number,
      default: 0
    },

    duplicateOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      default: null
    },
    resolvedBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      default:null
    },
    resolvedAt:{
      
    }
  },
  { timestamps: true }
);

// 🌍 GEO INDEX (IMPORTANT for future map queries)
complaintSchema.index({ "location": "2dsphere" });

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;