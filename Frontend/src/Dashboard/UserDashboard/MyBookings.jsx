import React, { useContext, useEffect, useState } from 'react';
import { BASE_URL } from '../../config.js';
import { authContext } from '../../context/AuthContext.jsx';
import ExpiredSlots from './ExpiredSlots.jsx';  // Import the ExpiredSlots component
import NotExpiredSlots from './NotExpiredSlots.jsx'; // Import the NotExpiredSlots component

const MyBookings = () => {
  const { user } = useContext(authContext);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for storing filtered slots
  const [expiredSlots, setExpiredSlots] = useState([]);
  const [notExpiredSlots, setNotExpiredSlots] = useState([]);
  const [activeSection, setActiveSection] = useState('notExpired'); // Track the active section

  useEffect(() => {
    const fetchSlotDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/user/bookings/${user._id}`);
        const data = await response.json();
        const slot = data.bookings;

        console.log(slot);
        if (Array.isArray(slot)) {
          // Filter slots into expired and non-expired
          const expired = slot.filter((slot) => checkBookingStatus(slot.booking_start, slot.booking_end) === 'expired');
          const notExpired = slot.filter((slot) => checkBookingStatus(slot.booking_start, slot.booking_end) !== 'expired');

          setExpiredSlots(expired);
          setNotExpiredSlots(notExpired);
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
      setLoading(false);
    }
  }, [user._id]);

  const checkBookingStatus = (startTime, endTime) => {
    const currentTime = new Date();
    const bookingEndTime = new Date(endTime);
    const bookingStartTime = new Date(startTime);
    return currentTime < bookingEndTime ? (currentTime > bookingStartTime ? 'active' : 'arriving') : 'expired';
  };

  const handleSectionToggle = (section) => {
    setActiveSection(section);
  };

  return (
    <div>
      {/* Section Toggle Buttons */}
      <div className="flex justify-center space-x-4 mb-4 mt-4">
        <button
          className={`px-4 py-2 rounded ${activeSection === 'notExpired' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleSectionToggle('notExpired')}
        >
          Not Expired
        </button>
        <button
          className={`px-4 py-2 rounded ${activeSection === 'expired' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleSectionToggle('expired')}
        >
          Expired
        </button>
      </div>

      {/* Conditionally render the active section */}
      {activeSection === 'notExpired' && <NotExpiredSlots notExpiredSlots={notExpiredSlots} />}
      {activeSection === 'expired' && <ExpiredSlots expiredSlots={expiredSlots} />}
    </div>
  );
};

export default MyBookings;
