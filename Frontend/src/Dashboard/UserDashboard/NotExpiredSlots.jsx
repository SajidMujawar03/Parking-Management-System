import React, { useEffect, useState } from 'react'; 

const NotExpiredBookings = ({ slots, checkBookingStatus, getRemainingTime }) => {
  const [remainingTimes, setRemainingTimes] = useState({});

  useEffect(() => {
    // Update remaining times every second
    const interval = setInterval(() => {
      const updatedTimes = {};
      slots.forEach((slot) => {
        const currentTime = new Date();
        const bookingEndTime = new Date(slot.booking_end);
        const remainingTimeInMs = bookingEndTime - currentTime;

        if (remainingTimeInMs <= 0) {
          updatedTimes[slot._id] = 'Expired';
        } else {
          const hours = Math.floor(remainingTimeInMs / (1000 * 60 * 60));
          const minutes = Math.floor((remainingTimeInMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remainingTimeInMs % (1000 * 60)) / 1000);
          updatedTimes[slot._id] = `${hours} hrs ${minutes} mins ${seconds} secs`;
        }
      });

      setRemainingTimes(updatedTimes);
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [slots]);

  return (
    <div>
      {slots.length > 0 ? (
        slots.map((slot) => {
          const end = new Date(slot.booking_end).toLocaleString();
          const status = checkBookingStatus(slot.booking_start, slot.booking_end);

          return (
            <div
              key={slot._id}
              className={`w-full relative ${status === 'active' ? 'bg-green-100' : 'bg-blue-100'} mt-2 rounded-md`}
            >
              <div className="p-2 flex items-center justify-start border-solid border-orange-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                  <div className="w-full sm:w-[275px] h-[100%]">
                    <img
                      src={slot.slot.photo}
                      className="w-full h-[200px] rounded-[20px]"
                      alt=""
                    />
                  </div>
                  <div>
                    <p>
                      {new Date(slot.booking_start).toLocaleString().split("G")[0]} - {end}
                    </p>
                    <p className="text-[18px] lg:text-[26px] text-slate-800 font-700">{`Paid Amount: Rs.${slot.total_amount}`}</p>
                    <p>Status: {status === 'active' ? 'Active' : 'Arriving'}</p>
                    {status === 'active' && (
                      <p className="font-semibold text-blue-600">
                        Remaining Time: {remainingTimes[slot._id] || 'Calculating...'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">No active or arriving bookings.</p>
      )}
    </div>
  );
};

export default NotExpiredBookings;