import Notification from "../models/Notification.model.js";


export const createNotification = async (userId, message, type = "system") => {
    await Notification.create({
        user: userId,
        message,
        type
    });
};