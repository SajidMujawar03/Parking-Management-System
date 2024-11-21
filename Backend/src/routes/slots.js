import { verifyToken,authorizeRoles } from "../auth/verifyToken.js";
import { createSlot,deleteSlot, getAllSlots, getSlot } from "../controllers/slotController.js";
import express from "express"

const router=express.Router()

router.get("/slot/:id",getSlot);
router.get('/slots',getAllSlots);
router.post('/create-slot',verifyToken, authorizeRoles('owner'),createSlot);
router.delete('/delete-slot/:id',verifyToken, authorizeRoles('owner'),deleteSlot);
// router.delete('/delete-slot/:id',deleteSlot);


export default router;