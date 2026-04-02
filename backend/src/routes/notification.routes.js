import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import Notification from '../models/Notification.model.js';

const router = express.Router();

// GET NOTIFICATIONS
router.get("/",authMiddleware, async(req,res)=>{
    const notifications = await Notification.find({
        user:req.user._id
    }).sort({createdAt: -1});

    res.json(notifications)
})

// MARK AS READ 
router.patch("/:id/read", authMiddleware, async(req,res)=>{
    const notification = await Notification.findById(req.params.id);

    notification.isRead = true;
    
    await notification.save();

    res.json({message: "Marked as read"})
})

export default router;