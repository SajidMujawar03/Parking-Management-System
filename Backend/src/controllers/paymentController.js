// routes/payment.js
const express = require('express');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const router = express.Router();

// Payment verification route
router.post('/verify-payment', async (req, res) => {
    const { orderId, paymentId, signature } = req.body;

    const generatedSignature = crypto
        .createHmac('sha256', 'your_razorpay_key_secret')
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

    if (generatedSignature === signature) {
        // Update booking status
        const booking = await Booking.findOneAndUpdate(
            { transactionId: orderId },
            { paymentStatus: 'completed', status: 'confirmed', transactionId: paymentId },
            { new: true }
        );
        
        res.json({ success: true, booking });
    } else {
        res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
});

module.exports = router;
