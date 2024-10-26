import express from "express";
import { verifyToken,authorizeRoles } from "../auth/verifyToken.js";
import { deleteProfile, getProfile, updateProfile ,getSlots } from "../controllers/ownerController.js";


const router=express.Router();

router.get("/owner-profile-me",getProfile)
router.put("/:id",updateProfile);
router.delete("/:id",deleteProfile);
router.get("/created-slots/:id",getSlots);
router.get("/",getAll)


export default router;
