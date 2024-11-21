// import React, { useContext, useEffect, useState } from 'react';
// import useFetchData from '../../hooks/useFetchData.jsx';
// import { BASE_URL } from '../../config.js';
// import Loading from '../../components/Loader/Loading.jsx';
// import Error from '../../components/Error/Error.jsx';
// import { authContext } from '../../context/AuthContext.jsx';
// import { uploadToCloudinary } from '../../utils/uploadToCloudinary.js';
// import { FaCircleExclamation } from "react-icons/fa6";
// import { IoIosAddCircleOutline } from "react-icons/io";
// import SlotCard from '../../components/Slots/SlotCard.jsx';


// const MyBookings = () => {
//   const [selectedFile, setSelectedFile] = useState('');
//   const [previewURL, setPreviewURL] = useState('');
//   const { user, token } = useContext(authContext);

//   const [isCreating, setIsCreating] = useState(false); // To handle form submission state
//   const [location, setLocation] = useState(null);
//   const [err, setErr] = useState(null);

//   // Fetch existing slots
//   const { data: slots, loading, error, refetch } = useFetchData(`${BASE_URL}/owner/created-slots/${user._id}`);

//   useEffect(() => {
//     // Get the current location using geolocation
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setLocation({ latitude, longitude });
//         },
//         (err) => {
//           setErr(err.message);
//         },
//         { enableHighAccuracy: true }
//       );
//     } else {
//       setErr("Geolocation is not supported by this browser.");
//     }
//   }, []);

//   // Initialize newSlot with empty fields
//   const [newSlot, setNewSlot] = useState({
//     photo: 'aaa',
//     hourly_price: '',
//     address: '',
//     coordinates: { latitude: '', longitude: '' },
//     owner: user._id,
//   });

//   useEffect(() => {
//     if (location) {
//       // Only update `newSlot` once `location` is available
//       setNewSlot((prevSlot) => ({
//         ...prevSlot,
//         coordinates: { latitude: location.latitude, longitude: location.longitude },
//       }));
//     }
//   }, [location]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewSlot({ ...newSlot, [name]: value });
//   };

//   const handleFileInputChange = async (e) => {

//     const file = e.target.files[0];

//     const data = await uploadToCloudinary(file);
//     // console.log(data.url)
//     setPreviewURL(data.url);
//     setSelectedFile(data.url);
//     setNewSlot((prevSlot) => ({
//       ...prevSlot,
//       photo: data.url,
//     }));
//   };

//   const handleAddSlot = async (e) => {
//     e.preventDefault();
//     setIsCreating(true);

//     // console.log(newSlot)

//     try {

//       if(isNaN(parseFloat(newSlot.hourly_price)))
//       {  throw new Error("Price should be number")}


//       console.log(newSlot)
//       const response = await fetch(`${BASE_URL}/slot/create-slot`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(newSlot),
//       });

//       const result=await response.json();

//       if (response.ok) {
//         await response.json();
//         // refetch();
//         setPreviewURL("")
//         setNewSlot({
//           photo: '',
//           hourly_price: '',
//           address: '',
//           coordinates: { latitude: '', longitude: '' },
//           owner: user._id,
//         });
//       } else {
//         throw new Error(result.message||'Failed to create slot');
//       }
//     } catch (error) {
//       console.error('Error adding slot:', error);
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   return (
//     <div>
//       {loading && !error && <Loading />}
//       {error && !loading && <Error errorMessage={error} />}
//       {!loading && !error && (

//         <div>
//           <div className='p-2 bg-[#ffffff] border-b-red-700 '>
//             <p className='flex justify-center items-center text-[#ff3030] font-500 text-[18px]'><FaCircleExclamation className='inline mr-1 text-red-500'/>Your Current Location Coordinates will be set for the navigation to the parking</p>
//           </div>

//           <form onSubmit={handleAddSlot} className=' rounded-md border border-orange-100'>
//             <div className='flex  items-center justify-between m-2 flex-wrap'>
//             <div className=" flex items-center gap-3 flex-1 min-w-[calc(50%-8px)] m-2">
//               {selectedFile && (
//                 <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-orange-500 flex items-center justify-center">
//                   <img src={previewURL} alt="" className="w-full rounded-full" />
//                 </figure>
//               )}
//               <div className="relative w-[130px] h-[50px] ">
//                 <label
//                   htmlFor="customFile"
//                   className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#ff840046] text-slate-900 font-semibold rounded-lg truncate cursor-pointer z-0"
//                 >
//                   Upload Photo
//                 </label>
//                 <input
//                   type="file"
//                   name="photo"
//                   id="customFile"
//                   accept=".jpg, .png"
//                   onChange={handleFileInputChange}
//                   className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-99"
//                 />
//               </div>
//             </div>
//             <input
//               type="text"
//               name="hourly_price"
//               value={newSlot.hourly_price}
//               onChange={handleInputChange}
//               placeholder="Enter Hourly Price in Rupees"
//               required
//               className='flex-1 min-w-[calc(50%-8px)] m-2 p-1 focus:outline-none border-solid  border-b border-orange-400'

//             />
//             <input
//               type="text"
//               name="address"
//               value={newSlot.address}
//               onChange={handleInputChange}
//               placeholder={`Detailed Address`}
//               required
//               className='h-[50px] w-[100%] text-start p-1 m-2 focus:outline-none  border-solid  border-b border-orange-400'
//             />
//             <div className='w-[100%]'> 
//             <button type="submit" disabled={isCreating} className='m-2 bg-orange-300 w-fit flex items-center justify-between p-2 font-[600] rounded-md text-slate-900  '>
//             <IoIosAddCircleOutline />
//               Add Slot
//             </button>
//             </div>
//             </div>
//           </form>

//           <div className=""> 
//           <h4 className='w-[100%] text-[32px] font-[500] text-slate-800 text-center'>YOUR SLOTS</h4>
//             {slots.length > 0 ? (
//               slots.map((slot) => (
                
//                 <div key={slot._id} className='w-[100%]'>
//                   <SlotCard slot={slot}/>
//                 </div>
                
//               ))
//             ) : (
//               <h3 className="mt-5 text-center text-orange-500 leading-7 text-[20px] font-semibold">
//                 You have not created any slot
//               </h3>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyBookings;






import React, { useContext, useEffect, useState } from 'react';
import { useGeolocated } from "react-geolocated";
import useFetchData from '../../hooks/useFetchData.jsx';
import { BASE_URL } from '../../config.js';
import Loading from '../../components/Loader/Loading.jsx';
import Error from '../../components/Error/Error.jsx';
import { authContext } from '../../context/AuthContext.jsx';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary.js';
import { FaCircleExclamation } from "react-icons/fa6";
import { IoIosAddCircleOutline } from "react-icons/io";
import SlotCard from '../../components/Slots/SlotCard.jsx';
import { toast } from 'react-toastify';

const MyBookings = () => {
  const [selectedFile, setSelectedFile] = useState('');
  const [previewURL, setPreviewURL] = useState('');
  const { user, token } = useContext(authContext);

  const [isCreating, setIsCreating] = useState(false); // To handle form submission state
  const [location, setLocation] = useState(null);
  const [err, setErr] = useState(null);

  // Fetch existing slots
  const { data: slots, loading, error, refetch } = useFetchData(`${BASE_URL}/owner/created-slots/${user._id}`);

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  });

  useEffect(() => {
    if (!isGeolocationAvailable) {
      setErr("Geolocation is not available in your browser.");
    } else if (!isGeolocationEnabled) {
      setErr("Geolocation is not enabled. Please enable it in your browser settings.");
    } else if (coords) {
      if (coords.accuracy <= 2000) {
        setLocation({ latitude: coords.latitude, longitude: coords.longitude });
      } else {
        setErr("Location accuracy is too low. Please move to an open space.");
      }
    }
  }, [coords, isGeolocationAvailable, isGeolocationEnabled]);

  const [newSlot, setNewSlot] = useState({
    photo: '',
    hourly_price: '',
    address: '',
    coordinates: { latitude: '', longitude: '' },
    owner: user._id,
  });

  useEffect(() => {
    if (location) {
      setNewSlot((prevSlot) => ({
        ...prevSlot,
        coordinates: { latitude: location.latitude, longitude: location.longitude },
      }));
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSlot({ ...newSlot, [name]: value });
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    const data = await uploadToCloudinary(file);
    setPreviewURL(data.url);
    setSelectedFile(data.url);
    setNewSlot((prevSlot) => ({
      ...prevSlot,
      photo: data.url,
    }));
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    // Check that latitude and longitude are not empty or invalid
    if (!newSlot.coordinates.latitude || !newSlot.coordinates.longitude) {
      setErr("Location is not valid.");
      setIsCreating(false);
      return;
    }

    try {
      if (isNaN(parseFloat(newSlot.hourly_price))) {
        throw new Error("Price should be a number");
      }

      const response = await fetch(`${BASE_URL}/slot/create-slot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSlot),
      });

      const result = await response.json();

      if (response.ok) {
        // Reset the form but keep the coordinates intact
        setPreviewURL('');
        setNewSlot({
          photo: '',
          hourly_price: '',
          address: '',
          coordinates: newSlot.coordinates, // Preserve coordinates
          owner: user._id,
        });

        toast.success("Slot created successfully!");

        // Refetch slots
        refetch();
      } else {
        throw new Error(result.message || 'Failed to create slot');
      }
    } catch (error) {
      console.error('Error adding slot:', error);
      toast.error(error.message || 'Error adding slot');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div>
      {loading && !error && <Loading />}
      {error && !loading && <Error errorMessage={error} />}
      {!loading && !error && (
        <div>
          <div className="p-2 bg-[#ffffff] border-b-red-700">
            <p className="flex justify-center items-center text-[#ff3030] font-500 text-[18px]">
              <FaCircleExclamation className="inline mr-1 text-red-500" />
              Your Current Location Coordinates will be set for the navigation to the parking
            </p>
          </div>

          {err && (
            <div className="p-2 text-red-500 font-semibold">
              <p>{err}</p>
            </div>
          )}

          <form onSubmit={handleAddSlot} className="rounded-md border border-orange-100">
            <div className="flex items-center justify-between m-2 flex-wrap">
              <div className="flex items-center gap-3 flex-1 min-w-[calc(50%-8px)] m-2">
                {selectedFile && (
                  <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-orange-500 flex items-center justify-center">
                    <img src={previewURL} alt="Preview" className="w-full rounded-full" />
                  </figure>
                )}
                <div className="relative w-[130px] h-[50px]">
                  <label
                    htmlFor="customFile"
                    className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#ff840046] text-slate-900 font-semibold rounded-lg truncate cursor-pointer z-0"
                  >
                    Upload Photo
                  </label>
                  <input
                    type="file"
                    name="photo"
                    id="customFile"
                    accept=".jpg, .png"
                    onChange={handleFileInputChange}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-99"
                    required
                  />
                </div>
              </div>
              <input
                type="text"
                name="hourly_price"
                value={newSlot.hourly_price}
                onChange={handleInputChange}
                placeholder="Enter Hourly Price in Rupees"
                required
                className="flex-1 min-w-[calc(50%-8px)] m-2 p-1 focus:outline-none border-solid border-b border-orange-400"
              />
              <input
                type="text"
                name="address"
                value={newSlot.address}
                onChange={handleInputChange}
                placeholder="Detailed Address"
                required
                className="h-[50px] w-[100%] text-start p-1 m-2 focus:outline-none border-solid border-b border-orange-400"
              />
              <div className="w-[100%]">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="m-2 bg-green-300 w-fit flex items-center justify-between p-2 font-[600] rounded-md text-green-900"
                >
                  <IoIosAddCircleOutline />
                  Add Slot
                </button>
              </div>
            </div>
          </form>

          <div>
            <h4 className="w-[100%] text-[32px] font-[500] text-slate-800 text-center">YOUR SLOTS</h4>
            {slots.length > 0 ? (
              slots.map((slot) => (
                <div key={slot._id} className="w-[100%]">
                  <SlotCard slot={slot} refetch={refetch} />
                </div>
              ))
            ) : (
              <h3 className="mt-5 text-center text-orange-500 leading-7 text-[20px] font-semibold">
                You have not created any slot
              </h3>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
