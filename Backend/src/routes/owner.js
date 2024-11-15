import express from "express";
import { verifyToken,authorizeRoles } from "../auth/verifyToken.js";
import { deleteProfile, getProfile, updateProfile ,getSlots, getAllOwners } from "../controllers/ownerController.js";


const router=express.Router();


router.get("/profile/me",verifyToken, authorizeRoles('owner'),getProfile)
router.put("/:id",updateProfile);
router.delete("/:id",verifyToken, authorizeRoles('owner'),deleteProfile);
router.get("/created-slots/:id",verifyToken, authorizeRoles('owner'),getSlots);
router.get("/",getAllOwners)


export default router;
