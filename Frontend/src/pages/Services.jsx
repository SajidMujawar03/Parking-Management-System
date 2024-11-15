import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { BASE_URL } from '../config';
import { Link } from 'react-router-dom';
import { FaLocationDot } from "react-icons/fa6";

const Services = () => {
    const [slots, setSlots] = useState([]);

    const fetchSlots = async () => {
        try {
            const response = await fetch(`${BASE_URL}/slot/slots`, {
                method: 'get',
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            setSlots(data.slots);
        } catch (error) {
            console.error("Error fetching slots:", error);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        // Add search logic here if needed
    };

    return (
        <>
            <section className='h-[80vh]'>
                <form onSubmit={handleSearch} className='container flex items-center justify-center'>
                    <div className='shadow-custom-shadow w-[60%] rounded-full flex'>
                        <input type="text" className='w-3/4 h-[50px] rounded-l-full px-[20px] focus:outline-none' />
                        <button type="submit" className='bg-orange-400 w-1/4 rounded-r-full font-bold text-white text-[18px] flex items-center justify-center gap-1'>
                            <FaSearch />
                            <span>Search</span>
                        </button>
                    </div>
                </form>

                <div className="container mt-8 flex justify-center">
                    {slots.length > 0 ? (
                        <ul className='w-[75%] h-fit grid grid-cols-1 place-items-center'>
                            {slots.map((slot, index) => (
                                <li key={index} className="p-2 shadow-lg mb-4 rounded-lg w-3/4 h-fit relative">
                                    <div className="p-2 flex items-center justify-start border-solid border-orange-200">
                                        <div className='flex gap-3 w-full relative'>
                                            <div className='w-[250px] h-[125px]'>
                                                <img src={slot.photo} className='w-[250px] h-[125px] rounded-[5px]' alt="" />
                                            </div>

                                            <div className='w-[300px]'>
                                                <p className='text-[14px] lg:text-[20px] text-slate-800 font-700 mt-0'>
                                                    Address : {slot.address}</p>
                                                <p className='text-[14px] lg:text-[20px] text-slate-800 font-700 mt-0'>
                                                    Hourly Price : Rs.{slot.hourly_price}
                                                </p>

                                                <div>
                                                    <p className='text-[14px] lg:text-[20px] text-slate-800 font-700 mt-0'>
                                                        Owner : {slot.owner.name}
                                                    </p>
                                                    <p className='text-[14px] lg:text-[20px] text-slate-800 font-700 mt-0'>
                                                        Contact : {slot.owner.phone}
                                                    </p>
                                                </div>
                                            </div>

                                            <FaLocationDot className='text-[30px] text-red-700 absolute right-0 top-0' />

                                            <Link to={`/booking/${slot._id}`} className='absolute bottom-0 right-0 bg-blue-400 h-[40px] w-[75px] rounded-full text-white font-bold text-center'>
                                                BOOK
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No slots available.</p>
                    )}
                </div>
            </section>
        </>
    );
};

export default Services;
