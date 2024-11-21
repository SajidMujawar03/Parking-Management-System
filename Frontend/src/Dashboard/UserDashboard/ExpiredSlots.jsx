import React from 'react';

const ExpiredSlots = ({ expiredSlots }) => {
  return (
    <div>
      <h3 className="font-semibold text-xl text-red-600 mb-2">Expired Bookings</h3>
      {expiredSlots.length > 0 ? (
        expiredSlots.map((slot) => {
          const startDate = new Date(slot.booking_start).toLocaleString();
          const endDate = new Date(slot.booking_end).toLocaleString();

          return (
            <div
              key={slot._id}
              className="w-[100%] relative bg-red-100 mt-2 rounded-md"
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
                    <p className="font-semibold text-red-600">Expired Booking</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p>No expired bookings.</p>
      )}
    </div>
  );
};

export default ExpiredSlots;
