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
        const slot=data.bookings;
        
        console.log(slot)
        // Check for empty data or unexpected response format
        if (Array.isArray(slot)) {
          setSlots(slot);
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

  // if (loading) {
  //   return <Loading />;
  // }

  // if (error) {
  //   return <Error message={error} />;
  // }

  return (
    <div>
      {slots.length > 0 ? (
        slots.map((slot) => (
          <div key={slot._id} className="w-[100%]">
             <>
        <div className="p-2 flex items-center justify-start border-solid border-orange-200">
            <div className='grid grid-cols-2 gap-5 w-full'>
            <div className='w-[275px] h-[100%]'>
                <img src={slot.slot.photo} className='w-[275px] h-[200px] rounded-[20px]' alt="" />
            </div>

            <div>
            <p className='text-[18px]  lg:text-[26px]  text-slate-800 font-700'>
                Paid Amount : Rs.{slot.total_amount}
            </p>
            <p>
                Address: {slot.slot.address}
            </p>
            </div>
        </div>

        </div>
    </>
          </div>
        ))
      ) : (
        <h3 className="mt-5 text-center text-orange-500 leading-7 text-[20px] font-semibold">
          You have not created any slot
        </h3>
      )}
    </div>
  );
};

export default MyBookings;
