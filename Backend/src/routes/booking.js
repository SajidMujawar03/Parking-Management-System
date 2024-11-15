import { verifyToken,authorizeRoles } from "../auth/verifyToken.js";

import express from "express"
import { getSlotBookings } from "../controllers/bookingController.js";

const router=express.Router()

router.get("/booking/:slotId",getSlotBookings);


export default router;