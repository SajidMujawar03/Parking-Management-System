import mongoose from "mongoose";



const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the user who gave the review
        required: true
    },
    slot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingSlot',  // Reference to the parking slot being reviewed
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5  // Assuming a 1-5 star rating system
    },
    comment: {
        type: String,
        required: false  // Optional, in case the user just leaves a rating without a comment
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Review=mongoose.model("Review",reviewSchema)
export default Review;