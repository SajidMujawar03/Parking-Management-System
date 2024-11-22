import React from 'react';

const ExpiredBookings = ({ slots }) => {
  
  return (
    <div>
    {slots.length > 0 ? (
      slots.map((slot) => {
        const end = new Date(slot.booking_end).toLocaleString();
        return (
          <div key={slot._id} className="w-full relative bg-red-100 mt-2 rounded-md">
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
                  <p className="text-[18px] lg:text-[26px] text-slate-800 font-700 m1">
                    Paid Amount: Rs.{slot.total_amount}
                  </p>
                  <p className="m-1">Address : {slot.slot.address}</p>
                  <p>Expired On : {end}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })
    ) : (
      <p className="text-center text-gray-500">No expired bookings.</p>
    )}
  </div>
  
  );
};

export default ExpiredBookings;
