import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import { FaCalendarAlt, FaClock, FaMoneyBillAlt } from 'react-icons/fa';
import { toast } from 'react-toastify'
import { authContext } from '../context/AuthContext.jsx'
// import { set } from 'mongoose';


const razorpay_id=import.meta.env.VITE_RAZORPAY_ID;
const razorpay_key=import.meta.env.RAZORPAY_KEY;



const BookingPage = () => {

    const {user}=useContext(authContext);
    const { slotId } = useParams();
    const navigate = useNavigate();
    const [slot, setSlot] = useState(null);
    const [bookingData,setBookingData]=useState(null);
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
        console.log(user)
        const fetchSlotDetails = async () => {
            try {
                const response = await fetch(`${BASE_URL}/slot/slot/${slotId}`);
                const data = await response.json();

                // console.log(data);
                setSlot(data.data);
            } catch (error) {
                console.error("Error fetching slot details:", error);
            }
        };
        const fetchBookingDetails = async () => {
            try {
                const response = await fetch(`${BASE_URL}/bookings/booking/${slotId}`);
                const res = await response.json();
                const data=res.data
        
                // console.log(response," ",data)
                // Check if data is an object
                if ( data !== null && typeof data === 'object') {
                    const today = new Date();
                    
                    // Assuming `data` is an object where the bookings are stored in a property like 'bookings'
                    // Adjust the structure based on your actual response
                    const filteredBookings = Object.entries(data.bookings)  // Convert 'bookings' to an array of entries
                        .filter(([key, dat]) => {
                            const bookingStartDate = new Date(dat.booking_start);  // Convert to Date object
                            const bookingEndDate = new Date(dat.booking_end);      // Convert to Date object
        
                            // Compare full date (year, month, day) of booking_start and booking_end with today's date
                            return (
                                bookingStartDate.getDate() === today.getDate() &&
                                bookingStartDate.getMonth() === today.getMonth() &&
                                bookingStartDate.getFullYear() === today.getFullYear() &&
                                bookingEndDate.getDate() === today.getDate() &&
                                bookingEndDate.getMonth() === today.getMonth() &&
                                bookingEndDate.getFullYear() === today.getFullYear()
                            );
                        })
                        .reduce((result, [key, dat]) => {
                            result[key] = dat;  // Rebuild the object with the filtered bookings
                            return result;
                        }, {});
        
                    console.log(filteredBookings);
                    setBookingData(filteredBookings)
                }

                
                console.log(bookingData)
            } catch (error) {
                console.error("err:", error);
            }
        };
        

        fetchSlotDetails();
        fetchBookingDetails();
    }, [slotId]);

    const handlePayment = async () => {
        try {
            // Prepare the selected time range
            const selectedFromDate = new Date(fromDate);
            const selectedToDate = new Date(toDate);
            const today = new Date();
    
            // Reset time components to 00:00:00 for an accurate date comparison
            const fromT = fromTime.split(':');
            const toT = toTime.split(':');
            selectedFromDate.setHours(fromT[0], fromT[1], 0, 0);
            selectedToDate.setHours(toT[0], toT[1], 0, 0);
            today.setHours(0, 0, 0, 0);
    
            // Validate that the selected date is not earlier than today
            if (selectedFromDate < today || selectedToDate < today) {
                throw new Error("The selected date cannot be earlier than today.");
            }
    
            if (selectedFromDate >= selectedToDate) {
                throw new Error("Time Conflict between start & end time");
            }

            
    
            // Step 1: Check availability of the slot
            const availabilityResponse = await fetch(`${BASE_URL}/bookings/check-availability`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    slotId,
                    fromDate: selectedFromDate.toISOString(),
                    toDate: selectedToDate.toISOString(),
                }),
            });

            

            if (!availabilityResponse.ok) {
                throw new Error(`Error: ${availabilityResponse.status}`);
            }
    
            const availabilityData = await availabilityResponse.json();
            if (!availabilityResponse.ok || !availabilityData.isAvailable) {
                throw new Error("The selected slot is not available for the chosen time.");
            }

            const totalHours=(selectedToDate-selectedFromDate)/(1.0*1000*60*60);
            const totalAmout=totalHours*slot.hourly_price;
    
            // Step 2: Create Razorpay order if the slot is available
            const response = await fetch(`${BASE_URL}/bookings/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    slotId,
                    amount: totalAmout,
                }),
            });
    
            const data = await response.json();

            console.log(data)
            if (!response.ok) {
                throw new Error(data.message || 'Payment order creation failed');
            }

            // console.log(data);
            
            
            // Step 3: Initiate Razorpay payment process
            const options = {
                key: razorpay_key, // Replace with your Razorpay API key
                amount: totalAmout,
                currency: 'INR',
                order_id: data.order_id,
                handler: async function (response) {
                    console.log(response)
                    const verifyResponse = await fetch(`${BASE_URL}/bookings/verify-payment`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            paymentId: response.razorpay_payment_id,
                            orderId: data.order_id,
                            razorpay_signature:response.razorpay_signature
                        }),
                    });


                    console.log(verifyResponse)


    
                    const verificationData = await verifyResponse.json();

                    if (verificationData.success) {
                        setPaymentStatus('Payment successful!');
                        
                        
                        console.log(totalHours)
                        console.log(selectedFromDate,"     ",selectedToDate)
                        
                        // Proceed to confirm booking
                        await fetch(`${BASE_URL}/bookings/book-slot`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                slotId,
                                fromDate: selectedFromDate,
                                toDate: selectedToDate,
                                totalHours:totalHours,
                                totalAmount:totalAmout,
                                paymentStatus:"completed",
                                userId:user._id,
                                paymentMethod:"Razorpay"

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
            console.log(error.message)
            toast.error(error.message);
            setPaymentStatus('Failed to initiate payment.');
        }
    };
    

   

    return (
        
        <div className="container mt-8 ">
            {slot?

                <div className='border border-solid p-2 grid grid-cols-1 place-items-center rounded-lg'>
            <h2 className="text-2xl font-bold mb-4 w-full">Book Slot: {slot.address}</h2>
            <div className={bookingData!==null && bookingData.length?"grid grid-cols-2 place-items-center":"grid grid-cols-1 place-items-center"}>
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
                <div className="mb-4 flex items-center">
                    <FaMoneyBillAlt className='mr-2'/> Price: Rs. {slot.hourly_price} per hour
                </div>
                <button onClick={handlePayment} className="bg-blue-500 text-white py-2 px-4 rounded-full">
                    Pay and Book
                </button>
                {paymentStatus && <div className="mt-4">{paymentStatus}</div>}
            </div>
            </div>
            </div>
            :
            <div>Loading data</div>
}
        </div>
        
        
    );
};

export default BookingPage;
