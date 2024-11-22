import React, { useContext, useEffect, useState } from 'react';
import { useGeolocated } from 'react-geolocated';
import useFetchData from '../../hooks/useFetchData.jsx';

import Loading from '../../components/Loader/Loading.jsx';
import Error from '../../components/Error/Error.jsx';
import { authContext } from '../../context/AuthContext.jsx';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary.js';
import { FaCircleExclamation } from 'react-icons/fa6';
import { IoIosAddCircleOutline } from 'react-icons/io';
import SlotCard from '../../components/Slots/SlotCard.jsx';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_BASE_URL;


const MyBookings = () => {
  const [selectedFile, setSelectedFile] = useState('');
  const [previewURL, setPreviewURL] = useState('');
  const { user, token } = useContext(authContext);

  const [isCreating, setIsCreating] = useState(false); // To handle form submission state
  const [location, setLocation] = useState(null);
  const [err, setErr] = useState(null);

  const { data: slots, loading, error, refetch } = useFetchData(`${import.meta.env.VITE_BASE_URL}/api/v1/owner/created-slots/${user._id}`);

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  });

  useEffect(() => {
    if (!isGeolocationAvailable) {
      setErr('Geolocation is not available in your browser.');
    } else if (!isGeolocationEnabled) {
      setErr('Geolocation is not enabled. Please enable it in your browser settings.');
    } else if (coords) {
      if (coords.accuracy <= 2000) {
        setLocation({ latitude: coords.latitude, longitude: coords.longitude });
      } else {
        setErr('Location accuracy is too low. Please move to an open space.');
      }
    }
  }, [coords, isGeolocationAvailable, isGeolocationEnabled]);

  const [newSlot, setNewSlot] = useState({
    photo: '',
    hourly_price: '',
    address: '',
    city: '',
    taluka: '',
    district: '',
    pincode: '',
    coordinates: { latitude: '', longitude: '' },
    owner: user._id,
    expiry_date: '',
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

    try {
      // Validation
      if (isNaN(parseFloat(newSlot.hourly_price))) {
        throw new Error('Price should be a number');
      }

      if (!newSlot.expiry_date) {
        throw new Error('Expiry date is required.');
      }

      // Combine all address fields
      const fullAddress = `${newSlot.address}, ${newSlot.city}, ${newSlot.taluka}, ${newSlot.district}, ${newSlot.pincode}`;
      const slotData = {
        ...newSlot,
        address: fullAddress,
      };

      // Send POST request to create slot
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/slot/create-slot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(slotData),
      });

      const result = await response.json();

      if (!response.ok) { throw new Error("Failed to create slot");}
        // Reset form state
        setPreviewURL('');
        setNewSlot({
          photo: '',
          hourly_price: '',
          address: '',
          coordinates: newSlot.coordinates,
          owner: user._id,
          expiry_date: '',
        });

        // Notify user
        toast.success('Slot created successfully!');
        refetch(); // Refresh the slots list
      
       
   
    } catch (error) {
      console.error('Error adding slot:');
      toast.error(error.message || 'Error adding slot');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="mt-2">
  {loading && !error && <Loading />}
  {error && !loading && <Error errorMessage={error} />}
  {!loading && !error && (
    <div className="p-4">
      {/* Add Slot Form */}
      <p className='text-res-400'>Please turn on your location</p>
      <form onSubmit={handleAddSlot} className="rounded-md border border-orange-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* File Upload */}
          <div className="flex items-center">
            {selectedFile && (
              <figure className="w-[50px] h-[50px] rounded-full border-2 border-orange-500 mr-4">
                <img src={previewURL} alt="Preview" className="rounded-full" />
              </figure>
            )}
            <label
              htmlFor="customFile"
              className="bg-orange-100 px-4 py-2 rounded-md text-slate-900 cursor-pointer"
            >
              Upload Photo
              <input
                type="file"
                id="customFile"
                onChange={handleFileInputChange}
                className="hidden"
                required
              />
            </label>
          </div>

          {/* Expiry Date */}
          <input
            type="datetime-local"
            name="expiry_date"
            value={newSlot.expiry_date}
            onChange={handleInputChange}
            className="p-2 border border-orange-400 rounded-md w-full"
            required
          />
        </div>

        {/* Address Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <input
            type="text"
            name="address"
            placeholder="Street Address"
            value={newSlot.address}
            onChange={handleInputChange}
            className="p-2 border border-orange-400 rounded-md w-full"
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={newSlot.city}
            onChange={handleInputChange}
            className="p-2 border border-orange-400 rounded-md w-full"
            required
          />
          <input
            type="text"
            name="taluka"
            placeholder="Taluka"
            value={newSlot.taluka}
            onChange={handleInputChange}
            className="p-2 border border-orange-400 rounded-md w-full"
            required
          />
          <input
            type="text"
            name="district"
            placeholder="District"
            value={newSlot.district}
            onChange={handleInputChange}
            className="p-2 border border-orange-400 rounded-md w-full"
            required
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={newSlot.pincode}
            onChange={handleInputChange}
            className="p-2 border border-orange-400 rounded-md w-full"
            required
          />
        </div>

        {/* Hourly Price */}
        <div className="mt-4 flex justify-between items-center">
          <input
            type="text"
            name="hourly_price"
            placeholder="Hourly Price"
            value={newSlot.hourly_price}
            onChange={handleInputChange}
            className="p-2 border border-orange-400 rounded-md flex-1 mr-4"
            required
          />
          <button
            type="submit"
            className="bg-green-400 text-white px-4 py-2 rounded-md"
          >
            Add Slot
          </button>
        </div>
      </form>

      <div>
      <h4 className="w-[100%] text-[32px] font-[500] text-slate-800 text-center">
        YOUR SLOTS
      </h4>
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
