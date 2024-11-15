import { verifyToken,authorizeRoles } from "../auth/verifyToken.js";

import express from "express"
import { bookSlot, checkAvailability, getSlotBookings } from "../controllers/bookingController.js";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";


const router=express.Router()

router.get("/booking/:slotId",getSlotBookings);
router.post('/check-availability',checkAvailability)
router.post("/create-order",createOrder)
router.post('/verify-payment',verifyPayment)
router.post('/book-slot',bookSlot)


export default router;