import mongoose from "mongoose";


const websiteReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the user giving the review
        required: true
    },
    email:{
        type:String,
        required:true
    },
    name:
    {
        type:String,
        required:true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5  // Assuming a 1-5 star rating system
    },
    comment: {
        type: String,
        required: false  // Optional comment for user feedback
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});


const WebsiteReview=mongoose.model("WebsiteReview",websiteReviewSchema)
export default WebsiteReview