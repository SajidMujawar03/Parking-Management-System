import React, { useContext, useEffect, useState } from 'react';
import { BASE_URL } from '../../config.js';
import SlotCard from '../../components/Slots/SlotCard.jsx';
import { authContext } from '../../context/AuthContext.jsx';

const MyBookings = () => {
  const { user } = useContext(authContext);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlotDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/user/bookings/${user._id}`);
        const data = await response.json();
        const slot = data.bookings;

        console.log(slot);
        // Check for empty data or unexpected response format
        if (Array.isArray(slot)) {
          // Sort the slots by status (active > arriving > expired), then by remaining time
          const sortedSlots = slot.sort((a, b) => {
            const statusA = checkBookingStatus(a.booking_start, a.booking_end);
            const statusB = checkBookingStatus(b.booking_start, b.booking_end);

            // First sort by status (active > arriving > expired)
            if (statusA !== statusB) {
              if (statusA === 'active') return -1; // active comes first
              if (statusB === 'active') return 1;
              if (statusA === 'arriving') return -1; // arriving comes second
              if (statusB === 'arriving') return 1;
            }

            // Then sort by remaining time within the same status
            const remainingTimeA = getRemainingTimeInMs(a.booking_end);
            const remainingTimeB = getRemainingTimeInMs(b.booking_end);
            return remainingTimeA - remainingTimeB;
          });

          setSlots(sortedSlots);
        } else {
          throw new Error("Unexpected data format");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchSlotDetails();
    } else {
      setLoading(false); // Handle case if `user._id` is not available
    }
  }, [user._id]);

  // Check if the booking is active, arriving, or expired
  const checkBookingStatus = (startTime, endTime) => {
    const currentTime = new Date();
    const bookingEndTime = new Date(endTime);
    const bookingStartTime = new Date(startTime);
    return currentTime < bookingEndTime
      ? currentTime > bookingStartTime
        ? 'active'
        : 'arriving'
      : 'expired';
  };

  const getDate = (date) => {
    const data = new Date(date);
    return data.toLocaleString();
  };

  // Calculate remaining time in milliseconds for active bookings
  const getRemainingTimeInMs = (endTime) => {
    const currentTime = new Date();
    const bookingEndTime = new Date(endTime);
    return bookingEndTime - currentTime;
  };

  // Calculate remaining time for active bookings in a readable format
  const getRemainingTime = (endTime) => {
    const remainingTimeInMs = getRemainingTimeInMs(endTime);

    if (remainingTimeInMs <= 0) {
      return 'Expired';
    }

    const remainingHours = Math.floor(remainingTimeInMs / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((remainingTimeInMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor(remainingTimeInMs / 1000) % 60;

    return `${remainingHours} hrs ${remainingMinutes} mins ${seconds}`;
  };

  // Set an interval to update the remaining time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSlots((prevSlots) => [...prevSlots]);
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div>
      {slots.length > 0 ? (
        slots.map((slot) => {
          const status = checkBookingStatus(slot.booking_start, slot.booking_end); // Assuming `end_time` exists in your data
          const startDate = getDate(slot.booking_start);
          const endDate = getDate(slot.booking_end);
          const remainingTime = status === 'active' ? getRemainingTime(slot.booking_end) : 'Expired';

          return (
            status !== "expired" && (
              <div
                key={slot._id}
                className={`w-[100%] relative ${status === 'active' ? 'bg-green-100' : (status === "expired" ? 'bg-red-100' : "bg-blue-100")} mt-2 rounded-md`}
              >
                <div className="p-2 flex items-center justify-start border-solid border-orange-200">
                  <div className="grid grid-cols-2 gap-5 w-full">
                    <div className="w-[275px] h-[100%]">
                      <img
                        src={slot.slot.photo}
                        className="w-[275px] h-[200px] rounded-[20px]"
                        alt=""
                      />
                    </div>

                    <div>
                      <p className="text-[18px] lg:text-[26px] text-slate-800 font-700">
                        Paid Amount: Rs.{slot.total_amount}
                      </p>

                      <pre>Started At : {startDate}</pre>
                      <pre>Ends At    : {endDate}</pre>
                      <p>Address: {slot.slot.address}</p>
                      {status === 'active' && (
                        <p className="font-semibold text-blue-600">
                          Remaining Time: {remainingTime}
                        </p>
                      )}
                      <p className={`font-semibold ${status === 'active' ? 'text-green-600' : (status === "expired" ? 'text-red-600' : "text-blue-600")}`}>
                        {status === 'active' ? 'Active Booking' : (status === "expired" ? 'Expired Booking' : "Arriving Booking")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          );
        })
      ) : (
        <h3 className="mt-5 text-center text-orange-500 leading-7 text-[20px] font-semibold">
          You have not Booked any Slot!!!
        </h3>
      )}
    </div>
  );
};

export default MyBookings;
