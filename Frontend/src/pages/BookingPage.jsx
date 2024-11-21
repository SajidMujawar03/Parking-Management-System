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
    const [amount,setAmount]=useState(0);
    const [slot, setSlot] = useState(null);
    const [bookingData,setBookingData]=useState(null);
    const [fromDate, setFromDate] = useState(() => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0'); // Ensure two digits
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = today.getFullYear();
        return `${year}-${month}-${day}`; // Format to 'dd-mm-yyyy'
    });
    
    const [fromTime, setFromTime] = useState(() => {
        const now = new Date();
        return now.toTimeString().slice(0, 5); // Format to 'HH:MM'
    });

    const [toDate, setToDate] = useState(() => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0'); // Ensure two digits
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = today.getFullYear();
        return `${year}-${month}-${day}`; // Format to 'dd-mm-yyyy'
    });
    
    const [toTime, setToTime] = useState(() => {
        const now = new Date();
        return now.toTimeString().slice(0, 5); // Format to 'HH:MM'
    });
    
    const [paymentStatus, setPaymentStatus] = useState('');

    useEffect(() => {
        // console.log(user)
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
                const datas=res.data;
        
                // console.log(datas)
                // Check if data is an object
                const today = new Date();

                // Function to convert date to IST and return only the date part
                function toIST(date) {
                    // const offset = 330; // IST offset in minutes (+5:30)
                    const localDate = new Date(date);
                    return localDate.toLocaleDateString(); // Indian format
                }

                const filteredData = datas.filter((data,index) => {
                    const FromDate = new Date(data.booking_start);
                    const ToDate = new Date(data.booking_end);

                    // console.log( index,"start",toIST(FromDate) ,"end",toIST(ToDate),toIST(today), toIST(FromDate) === toIST(today) ||
                    // toIST(ToDate) === toIST(today))
                    return (
                        
                        toIST(FromDate) === toIST(today) ||
                        toIST(ToDate) === toIST(today)
                    );
                });

                // console.log(filteredData)

                const indianTime = filteredData.map(data => {
                    
                    return {
                        ...data, // Preserve other properties
                        booking_start: new Date(data.booking_start).toLocaleString(), // Convert to IST
                        booking_end: new Date(data.booking_end).toLocaleString(), // Convert to IST
                        sc:1
                    };
                });
                
                // console.log(indianTime);
                

                // Update the state
                setBookingData(indianTime);
                
                console.log(bookingData)
            } catch (error) {
                console.error("err:", error);
            }
        };
        

        fetchSlotDetails();
        fetchBookingDetails();
    }, [slotId]);

    useEffect(() => {
        if (slot) {
            const calculateAmount = () => {
                const fromDateTime = new Date(`${fromDate}T${fromTime}`);
                const toDateTime = new Date(`${toDate}T${toTime}`);
                const totalHours = (toDateTime - fromDateTime) / (1000 * 60 * 60); // Convert milliseconds to hours

                if (totalHours > 0) {
                    setAmount((totalHours * slot.hourly_price).toFixed(0));
                } else {
                    setAmount(0); // Reset if invalid range
                }
            };

            calculateAmount();
        }
    }, [fromDate, fromTime, toDate, toTime, slot]);

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
                const avail=await availabilityResponse.json();
                throw new Error(`${avail.message}`);
            }
    
            const availabilityData = await availabilityResponse.json();
            if (!availabilityResponse.ok || !availabilityData.isAvailable) {
                throw new Error("The selected slot is not available for the chosen time.");
            }
            console.log("hi",selectedFromDate)

            const totalHours=(selectedToDate-selectedFromDate)/(1.0*1000*60*60);
            // const totalAmout=(totalHours*slot.hourly_price).toFixed(2);
    
            // Step 2: Create Razorpay order if the slot is available
            const response = await fetch(`${BASE_URL}/bookings/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    slotId,
                    amount: amount,
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
                amount: amount,
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
                                totalAmount:amount,
                                paymentStatus:"completed",
                                userId:user._id,
                                paymentMethod:"Razorpay"

                            }),
                        });
                        // navigate('/confirmation');  // Navigate to confirmation page
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
                    color: '#FFA500',
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
        
        <div className="container mt-8 w-full">
            {slot?
                <div className='grid grid-cols-2 w-full border border-solid rounded-lg'>                
            <div className=' p-2 grid grid-cols-1 place-items-center '>
            <h2 className="text-2xl font-bold mb-4 w-full text-center">Book Slot: {slot.address}</h2>
            <div className="grid grid-cols-1 place-items-center">
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
                <div>
                    <p className='m-1 text-blue-700 bg-blue-100 p-2 rounded-sm grid grid-flow-col place-items-center gap-1 place-content-center'>Total Amount : <b className=' text-[18px] '>{amount}</b></p>
                </div>
                <button onClick={handlePayment} className="bg-blue-500 text-white py-2 px-4 rounded-full">
                    Pay and Book
                </button>
                {paymentStatus && <div className="mt-4">{paymentStatus}</div>}
            </div>
            </div>
            </div>
            <div className='w-full text-center p-2'>
            <h2 className="text-2xl font-bold mb-4 w-full">Today's bookings for this slot</h2>
           

            {(bookingData && bookingData.length>0) ? 
            <div className='grid grid-cols-1'>{
            (
                      
                bookingData.map((data,index)=>(
                    <div key={index} className='bg-slate-200 p-1 mt-1 rounded-sm'>
                           <p>{data.booking_start} - {data.booking_end}</p> 
                  </div>
                ))
                
            )}</div>
            :
            <div>No Bookings are there for this slot</div>
            }
            </div>
            </div>

            :
            <div>Loading data</div>
}
        </div>
        
        
    );
};

export default BookingPage;
