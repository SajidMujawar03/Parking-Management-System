import React from 'react';

const NotExpiredBookings = ({ slots, checkBookingStatus, getRemainingTime }) => {
  return (
    <div>
    {slots.length > 0 ? (
      slots.map((slot) => {
        const end = new Date(slot.booking_end).toLocaleString();
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
                  <p className="text-[18px] lg:text-[26px] text-slate-800 font-700">{`Paid Amount: Rs.${slot.total_amount}`}</p>
                  <p>Status: {status === 'active' ? 'Active' : 'Arriving'}</p>
                  {status === 'active' && (
                    <p className="font-semibold text-blue-600">Remaining Time: {remainingTime}</p>
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
