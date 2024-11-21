import React from 'react';
import { CiCircleMinus } from "react-icons/ci";
import { BASE_URL } from '../../config.js';
import { toast } from 'react-toastify';

const SlotCard = ({ slot, refetch }) => {
  const { photo, hourly_price, address, _id } = slot;

  const handleDeleteSlot = async () => {
    try {
      const response = await fetch(`${BASE_URL}/slot/delete-slot/${_id}`, {
        method: 'DELETE',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });

      if (!response.ok) {
        throw new Error('Failed to delete slot');
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
        </div>
        <button
          onClick={handleDeleteSlot}
          className="m-2 w-fit flex items-center justify-between p-2 font-[600] rounded-md text-slate-900 border-red-500 absolute"
        >
          <CiCircleMinus />
          Delete Slot
        </button>
      </div>
    </div>
  );
};

export default SlotCard;
