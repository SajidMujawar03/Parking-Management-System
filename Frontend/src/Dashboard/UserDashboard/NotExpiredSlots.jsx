import React from 'react';

const NotExpiredSlots = ({ notExpiredSlots }) => {
  return (
    <div>
      <h3 className="font-semibold text-xl text-green-600 mb-2">Active & Arriving Bookings</h3>
      {notExpiredSlots.length > 0 ? (
        notExpiredSlots.map((slot) => {
          const status = slot.status;
          const startDate = new Date(slot.booking_start).toLocaleString();
          const endDate = new Date(slot.booking_end).toLocaleString();
          const remainingTime = status === 'active' ? getRemainingTime(slot.booking_end) : 'Arriving Soon';

          return (
            <div
              key={slot._id}
              className={`w-[100%] relative ${status === 'active' ? 'bg-green-100' : 'bg-blue-100'} mt-2 rounded-md`}
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
                    <p className={`font-semibold ${status === 'active' ? 'text-green-600' : 'text-blue-600'}`}>
                      {status === 'active' ? 'Active Booking' : 'Arriving Soon'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p>No active or arriving bookings.</p>
      )}
    </div>
  );
};

export default NotExpiredSlots;
