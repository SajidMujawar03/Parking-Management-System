// routes/booking.js
// const express = require('express');
// const Booking = require('../models/Booking');
// const Razorpay = require('razorpay');

import Razorpay from 'razorpay';
import express from 'express';
import Booking from '../models/booking.model.js';
const router = express.Router();

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: 'rzp_test_YkxntHHzYZ29ck',
    key_secret: 'sWnIGY8KegJJucEaBXZnlM2C',
});

export const getSlotBookings=async (req, res) => {
    const slotId=req.params.slotId;
    
    const slotBookings = await Booking.findOne({
        slotId
    });
    
    if (slotBookings==null) {
        return res.status(400).json({ message: 'No booking info' });
    }
    
    res.json({ success:true,message:"slot data",data:slotBookings });
}




// Check availability
router.post('/check-availability', async (req, res) => {
    const { slotId, bookingDate, startTime, endTime } = req.body;
    
    const overlappingBooking = await Booking.findOne({
        slotId,
        bookingDate,
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
        status: { $ne: 'cancelled' }
    });
    
    if (overlappingBooking) {
        return res.status(400).json({ message: 'Slot not available for the selected time.' });
    }
    
    res.json({ available: true });
});

// Create booking and initialize payment with Razorpay
router.post('/book', async (req, res) => {
    const { userId, slotId, bookingDate, startTime, endTime, amount } = req.body;

    // Check availability
    const overlappingBooking = await Booking.findOne({
        slotId,
        bookingDate,
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
        status: { $ne: 'cancelled' }
    });

    if (overlappingBooking) {
        return res.setatus(400).json({ message: 'Slot not available for the selected time.' });
    }

    // Create a new booking with 'pending' payment status
    const booking = new Booking({
        userId,
        slotId,
        bookingDate,
        startTime,
        endTime,
        amount
    });
    await booking.save();

    // Create Razorpay order
    const options = {
        amount: amount * 100, // Amount in paise
        currency: "INR",
        receipt: `receipt_order_${booking._id}`,
        notes: { bookingId: booking._id.toString() }
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json({ orderId: order.id, amount, currency: 'INR' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating payment order" });
    }
});



// module.exports = router;
