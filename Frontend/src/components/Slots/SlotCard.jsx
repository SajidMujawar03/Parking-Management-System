import React from 'react';
import { CiCircleMinus } from "react-icons/ci";

import { toast } from 'react-toastify';


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
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/slot/delete-slot/${_id}`, {
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
      
   
      refetch(); 
    } catch (error) {
      toast.error(error.message || 'Error deleting slot');
    }
  };

  return (
    <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-start border-solid border-orange-200 rounded-lg shadow-md relative">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
    
      <div className="w-full sm:w-[275px] h-auto flex justify-center">
        <img 
          src={photo} 
          className="w-full max-w-[275px] h-[200px] sm:h-auto rounded-[20px] object-cover" 
          alt="Slot" 
        />
      </div>
  
     
      <div className="flex flex-col justify-between">
        <p className="text-[16px] sm:text-[18px] lg:text-[26px] text-slate-800 font-semibold mb-2">
          Hourly Price: Rs.{hourly_price}
        </p>
        <p className="text-[14px] sm:text-[16px] text-slate-600 mb-2">
          Address: {address}
        </p>
        <p className="text-[14px] sm:text-[16px] text-slate-600 mb-4">
          Expiration Date: {date}
        </p>
      </div>
    </div>
  
  
    <button
      onClick={handleDeleteSlot}
      className="mt-4 sm:mt-0 sm:absolute sm:bottom-4 sm:right-4 w-full sm:w-auto flex items-center justify-center px-4 py-2 rounded-md border border-red-500 font-bold text-red-500"
    >
      <CiCircleMinus className="mr-2" />
      Delete Slot
    </button>
  </div>
  
  );
};

export default SlotCard;
