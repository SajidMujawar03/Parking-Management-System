// import React, { useContext, useEffect, useState } from 'react';
// import { BASE_URL } from '../../config.js';
// import { authContext } from '../../context/AuthContext.jsx';
// import ExpiredSlots from './ExpiredSlots.jsx';  // Import the ExpiredSlots component
// import NotExpiredSlots from './NotExpiredSlots.jsx'; // Import the NotExpiredSlots component

// const MyBookings = () => {
//   const { user } = useContext(authContext);
//   const [slots, setSlots] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // States for storing filtered slots
//   const [expiredSlots, setExpiredSlots] = useState([]);
//   const [notExpiredSlots, setNotExpiredSlots] = useState([]);
//   const [activeSection, setActiveSection] = useState('notExpired'); // Track the active section

//   useEffect(() => {
//     const fetchSlotDetails = async () => {
//       try {
//         const response = await fetch(`${BASE_URL}/user/bookings/${user._id}`);
//         const data = await response.json();
//         const slot = data.bookings;

//         console.log(slot);
//         if (Array.isArray(slot)) {
//           // Filter slots into expired and non-expired
//           const expired = slot.filter((slot) => checkBookingStatus(slot.booking_start, slot.booking_end) === 'expired');
//           const notExpired = slot.filter((slot) => checkBookingStatus(slot.booking_start, slot.booking_end) !== 'expired');

//           setExpiredSlots(expired);
//           setNotExpiredSlots(notExpired);
//         } else {
//           throw new Error("Unexpected data format");
//         }
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?._id) {
//       fetchSlotDetails();
//     } else {
//       setLoading(false);
//     }
//   }, [user._id]);

//   const checkBookingStatus = (startTime, endTime) => {
//     const currentTime = new Date();
//     const bookingEndTime = new Date(endTime);
//     const bookingStartTime = new Date(startTime);
//     return currentTime < bookingEndTime ? (currentTime > bookingStartTime ? 'active' : 'arriving') : 'expired';
//   };

//   const handleSectionToggle = (section) => {
//     setActiveSection(section);
//   };

//   return (
//     <div>
//       {/* Section Toggle Buttons */}
//       <div className="flex justify-center space-x-4 mb-4 mt-4">
//         <button
//           className={`px-4 py-2 rounded ${activeSection === 'notExpired' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
//           onClick={() => handleSectionToggle('notExpired')}
//         >
//           Not Expired
//         </button>
//         <button
//           className={`px-4 py-2 rounded ${activeSection === 'expired' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
//           onClick={() => handleSectionToggle('expired')}
//         >
//           Expired
//         </button>
//       </div>

//       {/* Conditionally render the active section */}
//       {activeSection === 'notExpired' && <NotExpiredSlots notExpiredSlots={notExpiredSlots} />}
//       {activeSection === 'expired' && <ExpiredSlots expiredSlots={expiredSlots} />}
//     </div>
//   );
// };

// export default MyBookings;


// import React, { useContext, useEffect, useState } from 'react';
// import { BASE_URL } from '../../config.js';
// import SlotCard from '../../components/Slots/SlotCard.jsx';
// import { authContext } from '../../context/AuthContext.jsx';

// const MyBookings = () => {
//   const { user } = useContext(authContext);
//   const [slots, setSlots] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   //expired slots
//   const [expired, setExpired] = useState([]);
//   const [notExpired, setNotExpires] = useState([]);

//   useEffect(() => {
//     const fetchSlotDetails = async () => {
//       try {
//         const response = await fetch(`${BASE_URL}/user/bookings/${user._id}`);
//         const data = await response.json();
//         const slot = data.bookings;

//         console.log(slot);
//         // Check for empty data or unexpected response format
//         if (Array.isArray(slot)) {
//           // Sort the slots by status (active > arriving > expired), then by remaining time
//           const sortedSlots = slot.sort((a, b) => {
//             const statusA = checkBookingStatus(a.booking_start, a.booking_end);
//             const statusB = checkBookingStatus(b.booking_start, b.booking_end);

//             // First sort by status (active > arriving > expired)
//             if (statusA !== statusB) {
//               if (statusA === 'active') return -1; // active comes first
//               if (statusB === 'active') return 1;
//               if (statusA === 'arriving') return -1; // arriving comes second
//               if (statusB === 'arriving') return 1;
//             }

//             // Then sort by remaining time within the same status
//             const remainingTimeA = getRemainingTimeInMs(a.booking_end);
//             const remainingTimeB = getRemainingTimeInMs(b.booking_end);
//             return remainingTimeA - remainingTimeB;
//           });

//           setSlots(sortedSlots);
//         } else {
//           throw new Error("Unexpected data format");
//         }
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?._id) {
//       fetchSlotDetails();
//     } else {
//       setLoading(false); // Handle case if user._id is not available
//     }
//   }, [user._id]);

//   // Check if the booking is active, arriving, or expired
//   const checkBookingStatus = (startTime, endTime) => {
//     const currentTime = new Date();
//     const bookingEndTime = new Date(endTime);
//     const bookingStartTime = new Date(startTime);
//     return currentTime < bookingEndTime
//       ? currentTime > bookingStartTime
//         ? 'active'
//         : 'arriving'
//       : 'expired';
//   };

//   const getDate = (date) => {
//     const data = new Date(date);
//     return data.toLocaleString();
//   };

//   // Calculate remaining time in milliseconds for active bookings
//   const getRemainingTimeInMs = (endTime) => {
//     const currentTime = new Date();
//     const bookingEndTime = new Date(endTime);
//     return bookingEndTime - currentTime;
//   };

//   // Calculate remaining time for active bookings in a readable format
//   const getRemainingTime = (endTime) => {
//     const remainingTimeInMs = getRemainingTimeInMs(endTime);

//     if (remainingTimeInMs <= 0) {
//       return 'Expired';
//     }

//     const remainingHours = Math.floor(remainingTimeInMs / (1000 * 60 * 60));
//     const remainingMinutes = Math.floor(
//       (remainingTimeInMs % (1000 * 60 * 60)) / (1000 * 60)
//     );
//     const seconds = Math.floor(remainingTimeInMs / 1000) % 60;

//     return `${remainingHours} hrs ${remainingMinutes} mins ${seconds}`;
//   };

//   // Set an interval to update the remaining time every second
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setSlots((prevSlots) => [...prevSlots]);
//     }, 1000); // Update every second

//     return () => clearInterval(interval); // Cleanup on unmount
//   }, []);

//   return (
//     <div>
//       {slots.length > 0 ? (
//         slots.map((slot) => {
//           const status = checkBookingStatus(
//             slot.booking_start,
//             slot.booking_end
//           ); // Assuming end_time exists in your data
//           const startDate = getDate(slot.booking_start);
//           const endDate = getDate(slot.booking_end);
//           const remainingTime =
//             status === 'active' ? getRemainingTime(slot.booking_end) : 'Expired';

//           return (
//             status !== 'expired' && (
//               <div
//                 key={slot._id}
//                 className={`w-[100%] relative ${
//                   status === 'active'
//                     ? 'bg-green-100'
//                     : status === 'expired'
//                     ? 'bg-red-100'
//                     : 'bg-blue-100'
//                 } mt-2 rounded-md`}
//               >
//                 <div className="p-2 flex items-center justify-start border-solid border-orange-200">
//                   <div className="grid grid-cols-2 gap-5 w-full">
//                     <div className="w-[275px] h-[100%]">
//                       <img
//                         src={slot.slot.photo}
//                         className="w-[275px] h-[200px] rounded-[20px]"
//                         alt=""
//                       />
//                     </div>

//                     <div>
//                       <p className="text-[18px] lg:text-[26px] text-slate-800 font-700">
//                         Paid Amount: Rs.{slot.total_amount}
//                       </p>

//                       <pre>Started At : {startDate}</pre>
//                       <pre>Ends At    : {endDate}</pre>
//                       <p>Address: {slot.slot.address}</p>
//                       {status === 'active' && (
//                         <p className="font-semibold text-blue-600">
//                           Remaining Time: {remainingTime}
//                         </p>
//                       )}
//                       <p
//                         className={`font-semibold ${
//                           status === 'active'
//                             ? 'text-green-600'
//                             : status === 'expired'
//                             ? 'text-red-600'
//                             : 'text-blue-600'
//                         }`}
//                       >
//                         {status === 'active'
//                           ? 'Active Booking'
//                           : status === 'expired'
//                           ? 'Expired Booking'
//                           : 'Arriving Booking'}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )
//           );
//         })
//       ) : (
//         <h3 className="mt-5 text-center text-orange-500 leading-7 text-[20px] font-semibold">
//           You have not Booked any Slot!!!
//         </h3>
//       )}
//     </div>
//   );
// };

// export default MyBookings;




import React, { useContext, useEffect, useState } from 'react';
// import { BASE_URL } from '../../config.js';
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
        const response = await fetch(`${BASE_URL}/user/bookings/${user._id}`);
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
