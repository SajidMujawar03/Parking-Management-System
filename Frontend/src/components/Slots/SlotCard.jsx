import React from 'react';
import { CiCircleMinus } from "react-icons/ci";
// import { BASE_URL } from '../../config.js';
import { toast } from 'react-toastify';

// Corrected BASE_URL line
const BASE_URL = import.meta.env.VITE_BASE_URL;

const SlotCard = ({ slot, refetch }) => {
  const { photo, hourly_price, address, _id, expiry_date } = slot;
  
  const date = expiry_date
    ? new Date(expiry_date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : 'No Expiration Date';

  const handleDeleteSlot = async () => {
    try {
      const response = await fetch(`${BASE_URL}/slot/delete-slot/${_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message);
      }

      toast.success("Slot deleted successfully!");
      
      // Refetch slots
      refetch(); 
    } catch (error) {
      toast.error(error.message || 'Error deleting slot');
    }
  };

  return (
    <div className="p-2 flex items-center justify-start border-solid border-orange-200 relative">
      <div className="grid grid-cols-2 gap-5 w-full">
        <div className="w-[275px] h-[100%]">
          <img src={photo} className="w-[275px] h-[200px] rounded-[20px]" alt="Slot" />
        </div>
        <div>
          <p className="text-[18px] lg:text-[26px] text-slate-800 font-700">
            Hourly Price: Rs.{hourly_price}
          </p>
          <p>Address: {address}</p>
          <p>Expiration Date : {date}</p>
        </div>
        <button
          onClick={handleDeleteSlot}
          className="m-2 w-fit flex items-center justify-between p-2  rounded-md  border-red-500 absolute bottom-0 right-0 border border-solid font-bold text-red-500"
        >
          <CiCircleMinus />
          Delete Slot
        </button>
      </div>
    </div>
  );
};

export default SlotCard;
