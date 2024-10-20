import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',  // Referencing the Booking model
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Referencing the User model
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    payment_method: {
        type: String,
        required: true
    },
    payment_status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    paid_on: {
        type: Date,
        default: Date.now
    }
});

export default Payment=mongoose.model("Payment",paymentSchema)