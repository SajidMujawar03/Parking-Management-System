import express from "express";
import { getSlots } from "../controllers/slotController.js";
import { deleteProfile, getProfile, updateProfile } from "../controllers/ownerController.js";


const router=express.Router();

router.get("/owner-profile-me",getProfile)
router.put("/:id",updateProfile);
router.delete("/:id",deleteProfile);
router.get("/created-slots",getSlots);


export default router;
