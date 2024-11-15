import React from 'react'
import { Link } from 'react-router-dom'
import { BsArrowRight } from 'react-icons/bs'
// import starIcon from "../../assets/images/starIcon.jpg"
const SlotCard = ({slot}) => {
    const {photo,status,hourly_price,address,added_on}=slot
  return (
    <>
        <div className="p-2 flex items-center justify-start border-solid border-orange-200">
            <div className='grid grid-cols-2 gap-5 w-full'>
            <div className='w-[275px] h-[100%]'>
                <img src={photo} className='w-[275px] h-[200px] rounded-[20px]' alt="" />
            </div>

            <div>
            <p className='text-[18px]  lg:text-[26px]  text-slate-800 font-700'>
                Hourly Price : Rs.{hourly_price}
            </p>
            <p>
                Address: {address}
            </p>
            </div>
        </div>

        </div>
    </>
  )
}

export default SlotCard