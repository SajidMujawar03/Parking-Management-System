import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import { FaCalendarAlt, FaClock, FaMoneyBillAlt } from 'react-icons/fa';
import { toast } from 'react-toastify'


const BookingPage = () => {
    const { slotId } = useParams();
    const navigate = useNavigate();
    const [slot, setSlot] = useState(null);
    const [fromDate, setFromDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'
    });
    
    const [fromTime, setFromTime] = useState(() => {
        const now = new Date();
        return now.toTimeString().slice(0, 5); // Format to 'HH:MM'
    });

    const [toDate, setToDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'
    });
    
    const [toTime, setToTime] = useState(() => {
        const now = new Date();
        return now.toTimeString().slice(0, 5); // Format to 'HH:MM'
    });
    
    const [paymentStatus, setPaymentStatus] = useState('');

    useEffect(() => {
        const fetchSlotDetails = async () => {
            try {
                const response = await fetch(`${BASE_URL}/slot/slot/${slotId}`);
                const data = await response.json();

                console.log(data);
                setSlot(data.data);
            } catch (error) {
                console.error("Error fetching slot details:", error);
            }
        };
        const fetchBookingDetails=async()=>{
            try {
                const response = await fetch(`${BASE_URL}/bookings/booking/${slotId}`);
                const data = await response.json();

                console.log(data);
               
            } catch (error) {
                console.error("Error fetching slot details:", error);
            }
        }

        fetchSlotDetails();
        fetchBookingDetails();
    }, [slotId]);

    const handlePayment = async () => {
        try {

            const selectedFromDate = new Date(fromDate);
            const selectedToDate=new Date(toDate)
            const today = new Date();
    
            // Reset time components to 00:00:00 for an accurate date comparison
            const fromT=fromTime.split(':');
            const toT=toTime.split(':');
            selectedFromDate.setHours(fromT[0],fromT[1],0,0);
            selectedToDate.setHours(toT[0],toT[1],0,0);
            today.setHours(0, 0, 0, 0);
    
           
            // Validate that the selected date is not earlier than today
            if (selectedFromDate < today || selectedToDate<today) {
                throw new Error("The selected date cannot be earlier than today.");
            }

            
            if(selectedFromDate>=selectedToDate)
            {
                throw new Error("Time Conflict between start & end time");
            }



            const response = await fetch(`${BASE_URL}/api/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    slotId,
                    amount: slot.hourly_price,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Payment order creation failed');
            }

            const options = {
                key: 'sWnIGY8KegJJucEaBXZnlM2C',
                amount: data.amount,
                currency: 'INR',
                order_id: data.order_id,
                handler: async function (response) {
                    const verifyResponse = await fetch(`${BASE_URL}/api/verify-payment`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            paymentId: response.razorpay_payment_id,
                            orderId: data.order_id,
                        }),
                    });

                    const verificationData = await verifyResponse.json();
                    if (verificationData.success) {
                        setPaymentStatus('Payment successful!');
                        // Proceed to confirm booking
                        await fetch(`${BASE_URL}/api/book-slot`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                slotId,
                                date,
                                time,
                            }),
                        });
                        navigate('/confirmation');  // Navigate to confirmation page
                    } else {
                        setPaymentStatus('Payment verification failed!');
                    }
                },
                prefill: {
                    name: 'User Name',
                    email: 'user@example.com',
                    contact: '1234567890',
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {

            toast.error(error.message)
            setPaymentStatus('Failed to initiate payment.');
        }
    };

   

    return (
        
        <div className="container mt-8 ">
            {slot?
            
                <div className='border border-solid p-2 grid grid-cols-1 place-items-center rounded-lg'>
            <h2 className="text-2xl font-bold mb-4 w-full">Book Slot: {slot.address}</h2>
            <div className="flex flex-col items-center border border-solid border-blue-400 w-[300px] p-2 rounded-lg">
                <img src={slot.photo} alt="Slot" className="w-60 h-32 mb-4" />
                <div>
                    <p>FROM :</p>
                <div className='flex mt-1 justify-between'>
                <div className="mb-4">
                    <p className='flex items-center'><FaCalendarAlt className='mr-1'/>  Date:</p>
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>
                <div className="mb-4">
                <p className='flex items-center'><FaClock className='mr-1'/> Time:</p>
                    <input type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)} />
                </div>
                </div>
                </div>
                <div>
                    <p>TO :</p>
                <div className='flex mt-1 justify-between'>
                <div className="mb-4">
                <p className='flex items-center'><FaCalendarAlt className='mr-1'/>  Date:</p>
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
                <div className="mb-4">
                <p className='flex items-center'><FaClock className='mr-1'/> Time:</p>
                    <input type="time" value={toTime} onChange={(e) => setToTime(e.target.value)} />
                </div>
                </div>
                </div>
                <div className="mb-4">
                    <FaMoneyBillAlt /> Price: Rs. {slot.hourly_price} per hour
                </div>
                <button onClick={handlePayment} className="bg-blue-500 text-white py-2 px-4 rounded-full">
                    Pay and Book
                </button>
                {paymentStatus && <div className="mt-4">{paymentStatus}</div>}
            </div>
            </div>
            :
            <div>Loading data</div>
}
        </div>
        
        
    );
};

export default BookingPage;
