// routes/booking.js
// const express = require('express');
// const Booking = require('../models/Booking');
// const Razorpay = require('razorpay');

import Razorpay from 'razorpay';
// import express from 'express';
import Booking from '../models/booking.model.js';
import Slot from '../models/slot.model.js';
import User from '../models/user.model.js';
// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: 'rzp_test_YkxntHHzYZ29ck',
    key_secret: 'sWnIGY8KegJJucEaBXZnlM2C',
});



export const getSlotBookings=async (req, res) => {
    const slotId=req.params.slotId;
    
    const slotBookings = await Booking.find({
        slot:slotId
    });
    
    if (slotBookings==null) {
        return res.status(404).json({success:false, message: 'No booking info' });
    }
    
    res.json({ success:true,message:"slot data",data:slotBookings });
}




// Check availability
export const checkAvailability = async (req, res) => {
    const { slotId, fromDate, toDate } = req.body;
    try {

        
        const slot = await Slot.findById(slotId);
        const bookings = await Booking.find({ slot: slotId });
        const options = {
            timeZone: 'Asia/Kolkata'
        };
        

        // Check if any existing booking overlaps with the requested time range
        const isAvailable = bookings.every((booking) => {
            const bookingStart = new Date(booking.booking_start);
            const bookingEnd = new Date(booking.booking_end);

            console.log(bookingStart ,"   ",new Date(fromDate))
            console.log(bookingEnd ,"   ",new Date(toDate))


            return (new Date(fromDate) >= bookingEnd || new Date(toDate) <= bookingStart);
        });

        if (isAvailable) {
            return res.json({ isAvailable: true });
        } else {
            return res.status(404).json({ isAvailable: false, message: "Slot is not available." });
        }
    } catch (error) {
        // console.error("Error checking availability:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Book Slot Endpoint
export const bookSlot= async (req, res) => {
    try {
        const { slotId, fromDate, toDate,totalAmount,userId,paymentStatus,totalHours,paymentMethod } = req.body;

        // Check if the slot is already booked for the selected date range
        const existingBooking = await Booking.findOne({
            slot: slotId,
            booking_start: { $lte: new Date(toDate) },
            booking_end: { $gte: new Date(fromDate) },
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'Slot is already booked for the selected time' });
        }

        // const totalHours = (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60);

        // Create a new booking
        const booking = new Booking({
            slot: slotId,
            booking_start: fromDate,
            booking_end: toDate,
            total_hours: totalHours,
            total_amount: totalAmount,
            payment_status: paymentStatus||"pending",
            payment_method:paymentMethod||"Razorpay",
            user:userId
        });




        await booking.save();

        await User.findByIdAndUpdate(userId, {
            $push: { slots: slotId }  // Push the booking's ID to the bookings array
        });
        res.json({ success: true, message: 'Slot booked successfully' });
    } catch (error) {
        // console.error('Error booking slot:', error);
        res.status(500).json({ message: 'Server error while booking slot' });
    }
};


export const getBookings=async(req,res)=>{
    const userId=req.params.userId;
    try {
        
        const bookings=await Booking.find({user:userId}).populate('slot');
        
        // console.log("hi")
        // console.log(bookings)
        if(!bookings)
            res.status(404).json({success:false,message:"No slots available"});
        
        res.status(200).json({success:true,message:"got slots",bookings})
    } catch (error) {
        // console.log(error.message)
        res.status(500).json({success:false,message:"Internal error"})
    }
}