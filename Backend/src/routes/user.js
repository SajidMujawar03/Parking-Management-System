import express  from "express"
import { deleteProfile, getAllUsers, getProfile, getUser, updateProfile } from "../controllers/usercontroller.js";
import { getSlots } from "../controllers/usercontroller.js";
import { verifyToken,authorizeRoles } from "../auth/verifyToken.js";
import { getBookings } from "../controllers/bookingController.js";


const router=express.Router();

// authorization
router.get('/profile/me',verifyToken, authorizeRoles('user'),getProfile);

//only this is remaining
// router.get('/user/profile/me',getProfile);

//completed
router.get('/:id',getUser);
router.put("/:id",updateProfile);
router.delete("/:id",verifyToken, authorizeRoles('user'),deleteProfile);
router.get("/my-booking",verifyToken, authorizeRoles('user'),getSlots);
router.get("/",getAllUsers);
router.get("/bookings/:userId",getBookings)


export default router;