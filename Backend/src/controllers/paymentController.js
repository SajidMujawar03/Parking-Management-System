
import razorpay from 'razorpay';
import Booking from '../models/booking.model.js';
import Slot from "../models/slot.model.js"
import crypto from "crypto"
import dotenv from "dotenv"
dotenv.config()


// Razorpay instance
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_ID,    // Replace with your Razorpay Key ID
    key_secret: process.env.RAZORPAY_KEY,  // Replace with your Razorpay Key Secret
});

// Create Order Endpoint
export const createOrder= async (req, res) => {
    try {
        const { slotId, amount } = req.body;  // Extract slotId and amount from the request body

        // Ensure the amount is in the smallest currency unit (paise)
        const amountInPaise = amount * 100;

        // Create Razorpay order
        const options = {
            amount: amountInPaise,  // Amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,  // Generate a unique receipt ID
            payment_capture: 1,  // Automatically capture the payment
        };

        console.log(amountInPaise,amount)

        const order = await razorpayInstance.orders.create(options);

        if (!order) {
            return res.status(500).json({ message: 'Error creating Razorpay order' });
        }

        // Return the order details to the frontend
        res.json({
            order_id: order.id,
            amount: amountInPaise,
            currency: 'INR',
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error while creating order' });
    }
};





// Verify Payment Endpoint
export const verifyPayment= async (req, res) => {
    try {
        // console.log(req.body)
        const { paymentId, orderId } = req.body;

        const secret = process.env.RAZORPAY_KEY;  // Replace with your Razorpay Key Secret

        // Create a signature to validate the payment
        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(orderId + '|' + paymentId);
        const generatedSignature = hmac.digest('hex');

        // Compare the generated signature with the signature sent by Razorpay
        const { razorpay_signature } = req.body;

        if (generatedSignature === razorpay_signature) {
            // Payment is verified
            res.json({ success: true ,message:"Payment verified"});
        } else {
            res.status(400).json({ success: false, message: 'Payment verification failed' });
        }
    } catch (error) {
        // console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Server error while verifying payment' });
    }
};
