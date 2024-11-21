import express from "express"
import { postReview } from "../controllers/reviewController.js";


const router=express.Router()


router.post("/review",postReview);

export default router;