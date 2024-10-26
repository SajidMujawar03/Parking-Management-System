import express  from "express"
import { deleteProfile, getAllUsers, getProfile, getUser, updateProfile } from "../controllers/usercontroller.js";
import { getSlots } from "../controllers/usercontroller.js";
import { verifyToken,authorizeRoles } from "../auth/verifyToken.js";


const router=express.Router();

// authorization
// router.get('/user-profile-me',verifyToken, authorizeRoles('user'),getProfile);

router.get('/user-profile-me',getProfile);
router.get('/:id',getUser);
router.put("/:id",updateProfile);
router.delete("/:id",deleteProfile);
router.get("/booked-slots/:id",getSlots);
router.get("/",getAllUsers);



export default router;