
import React, { useContext, useEffect, useState } from 'react';

import { authContext } from '../../context/AuthContext.jsx';
import ExpiredSlots from './ExpiredSlots.jsx';
import NotExpiredSlots from './NotExpiredSlots.jsx';


const BASE_URL = import.meta.env.VITE_BASE_URL;


const MyBookings = () => {
  const { user } = useContext(authContext);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('notExpired'); // Toggle state for view

  useEffect(() => {
    const fetchSlotDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/user/bookings/${user._id}`);
        const data = await response.json();
        const slot = data.bookings;

        if (Array.isArray(slot)) {
          setSlots(slot);
        } else {
          throw new Error('Unexpected data format');
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
      setLoading(false);
    }
  }, [user._id]);

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

  const getRemainingTime = (endTime) => {
    const currentTime = new Date();
    const bookingEndTime = new Date(endTime);
    const remainingTimeInMs = bookingEndTime - currentTime;

    if (remainingTimeInMs <= 0) {
      return 'Expired';
    }

    const remainingHours = Math.floor(remainingTimeInMs / (1000 * 60 * 60));
    const remainingMinutes = Math.floor(
      (remainingTimeInMs % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor(remainingTimeInMs / 1000) % 60;

    return `${remainingHours} hrs ${remainingMinutes} mins ${seconds}`;
  };

  // Filter slots by expired and not expired
  const expiredSlots = slots.filter(
    (slot) => checkBookingStatus(slot.booking_start, slot.booking_end) === 'expired'
  );
  const notExpiredSlots = slots.filter(
    (slot) => checkBookingStatus(slot.booking_start, slot.booking_end) !== 'expired'
  );

  return (
    <div>
    <div className="flex justify-center mb-4 mt-2">
      <button
        onClick={() => setView('notExpired')}
        className={`px-4 py-2 mx-2 ${
          view === 'notExpired' ? 'bg-green-500 text-white' : 'bg-gray-200'
        } rounded`}
      >
        Not Expired Bookings
      </button>
      <button
        onClick={() => setView('expired')}
        className={`px-4 py-2 mx-2 ${
          view === 'expired' ? 'bg-red-500 text-white' : 'bg-gray-200'
        } rounded`}
      >
        Expired Bookings
      </button>
    </div>
  
    {loading ? (
      <p className="text-center m-2">Loading...</p>
    ) : error ? (
      <p className="text-center text-red-500 m-2">{error}</p>
    ) : view === 'notExpired' ? (
<NotExpiredSlots
  slots={notExpiredSlots}
  checkBookingStatus={checkBookingStatus}
  getRemainingTime={getRemainingTime}
/>

    ) : (
      <ExpiredSlots slots={expiredSlots} />
    )}
  </div>
  
  );
};

export default MyBookings;
