import express  from "express"
import { deleteuser, getProfile, getSlots, updateUser } from "../controllers/usercontroller.js";
const router=express.Router();

router.get('/user-profile-me',getProfile);
router.put("/:id",updateUser);
router.delete("/:id",deleteuser);
router.get("/booked-slots",getSlots);