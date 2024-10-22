import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Referencing the User model for the user who books
        required: true
    },
    slot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingSlot',  // Referencing the ParkingSlot model
        required: true
    },
    booking_start: {
        type: Date,
        required: true
    },
    booking_end: {
        type: Date,
        required: true
    },
    total_hours: {
        type: Number,
        required: true
    },
    total_amount: {
        type: Number,
        required: true
    },
    booking_status: {
        type: String,
        enum: ['confirmed', 'completed', 'cancelled'],
        default: 'confirmed'
    },
    booked_on: {
        type: Date,
        default: Date.now
    }
});

export default Booking=mongoose.model("Booking",bookingSchema);