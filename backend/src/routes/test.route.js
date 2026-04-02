import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/public", ( req,res)=>{
    res.json({message: "Public route working"})
});

router.get("/protected", authMiddleware, ( req,res)=>{
    res.json({message: "Protected route working"})
});

router.get("/admin", authMiddleware, authorizeRoles("admin"),(req,res)=>{
    res.json({
        message: "Admin route working",
        user: req.user
     })
})

export default router;