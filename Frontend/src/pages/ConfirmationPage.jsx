import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ConfirmationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Optionally, you can extract state from the location object, if passed during navigation
    const { slot, date, time } = location.state || {};  // Assuming we pass state on navigation

    return (
        <div className="container mx-auto mt-8 p-4">
            <h2 className="text-3xl font-bold text-center mb-4">Booking Confirmed!</h2>
            <div className="flex flex-col items-center bg-green-100 p-6 rounded-lg shadow-md">
                <p className="text-lg mb-2">Thank you for booking with us!</p>
                <div className="mb-4">
                    <strong className="text-xl">Booking Details:</strong>
                    <div className="mt-2">
                        <div><strong>Slot Address:</strong> {slot ? slot.address : 'N/A'}</div>
                        <div><strong>Price:</strong> Rs. {slot ? slot.hourly_price : 'N/A'} per hour</div>
                        <div><strong>Date:</strong> {date}</div>
                        <div><strong>Time:</strong> {time}</div>
                    </div>
                </div>
                <button
                    className="bg-blue-500 text-white py-2 px-6 rounded-full"
                    onClick={() => navigate('/')}
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
};

export default ConfirmationPage;
