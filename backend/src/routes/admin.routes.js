import express from 'express';
import authMiddleware from "../middlewares/auth.middleware.js"
import authorizeRoles from "../middlewares/role.middleware.js";

import { updateComplaintStatus, resolveComplaint } from "../controllers/admin.controller.js";

const router = express.Router();

router.patch("/complaints/:id/status",authMiddleware, authorizeRoles("admin"), updateComplaintStatus);

router.patch("/complaints/:id/resolve", authMiddleware, authorizeRoles("admin"), resolveComplaint)

export default router;