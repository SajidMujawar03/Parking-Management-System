import express  from "express"
import { deleteProfile, getProfile, updateProfile } from "../controllers/usercontroller.js";
import { getSlots } from "../controllers/slotController.js";


const router=express.Router();

router.get('/user-profile-me',getProfile);
router.put("/:id",updateProfile);
router.delete("/:id",deleteProfile);
router.get("/booked-slots",getSlots);