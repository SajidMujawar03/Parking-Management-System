

import React, { useContext, useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";

import { Link, useNavigate } from 'react-router-dom';
import { FaLocationDot } from "react-icons/fa6";
import Fuse from 'fuse.js';
import { authContext } from '../context/AuthContext'
import { toast } from 'react-toastify';


const BASE_URL = import.meta.env.VITE_BASE_URL;


const Services = () => {
    const [slots, setSlots] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSlots, setFilteredSlots] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 1000]); 
    const [ownerFilter, setOwnerFilter] = useState('');
    const [expiryDateFilter, setExpiryDateFilter] = useState(''); 
    
    const {user} = useContext(authContext)
    const navigate = useNavigate();

    const fetchSlots = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/slot/slots`, {
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
            setFilteredSlots(data.slots);  
        } catch (error) {
            console.error("Error gettinging slots:", error);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    const handleSearchInput = (e) => {
        setSearchQuery(e.target.value);
    };

    const handlePriceChange = (e) => {
        const [min, max] = e.target.value.split('-');
        setPriceRange([parseInt(min), parseInt(max)]);
    };

    const handleOwnerFilter = (e) => {
        setOwnerFilter(e.target.value);
    };

    const handleExpiryDateChange = (e) => {
        setExpiryDateFilter(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();

        let filtered = slots;

        if (searchQuery) {
            const fuse = new Fuse(filtered, {
                keys: ['address', 'owner.name'], 
                includeScore: true,
                threshold: 0.4, 
            });
            filtered = fuse.search(searchQuery).map(result => result.item); 
        }

        
        if (priceRange) {
            filtered = filtered.filter(slot => slot.hourly_price >= priceRange[0] && slot.hourly_price <= priceRange[1]);
        }

        if (ownerFilter) {
            filtered = filtered.filter(slot => slot.owner.name.toLowerCase().includes(ownerFilter.toLowerCase()));
        }
       

        if (expiryDateFilter) {
            filtered = filtered.filter(slot => {
                const expiryDate = new Date(slot.expiry_date);
                const filterDate = new Date(expiryDateFilter);
                return expiryDate >= filterDate; // Only show slots with expiry date greater than or equal to the selected date
            });
        }

        setFilteredSlots(filtered);
    };

    const handleOpenMaps = (latitude, longitude) => {
        if (latitude && longitude) {
            const url = `https://www.google.com/maps/place/${latitude},${longitude}`;
            window.open(url, '_blank');
        }
    };

    const toastMessage = (slot) => {
        (user && user.role === 'user') ? toast.success(`Hi ${user.name}!!`) : toast.error("Only Visitors can Book")
         user.role === 'user' ? navigate(`/booking/${slot._id}`) : navigate('/login')
    }

    return (
        <section className="h-fit">
        <form onSubmit={handleSearch} className="container flex flex-wrap items-center justify-center gap-4">
          <div className="shadow-custom-shadow w-full md:w-3/4 lg:w-1/2 rounded-full flex">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInput}
              className="w-3/4 h-12 rounded-l-full px-4 focus:outline-none text-sm md:text-base"
              placeholder="Search by address or owner"
            />
            <button
              type="submit"
              className="bg-orange-400 w-1/4 rounded-r-full font-bold text-white text-sm md:text-base flex items-center justify-center gap-1"
            >
              <FaSearch />
              <span>Search</span>
            </button>
          </div>
        </form>
      
        <div className="mt-8 container flex flex-wrap justify-center gap-5">
          <select
            onChange={handlePriceChange}
            className="border p-2 rounded text-sm md:text-base w-full sm:w-auto"
          >
            <option value="0-1000">Price: All</option>
            <option value="0-200">Price: 0-200</option>
            <option value="200-400">Price: 200-400</option>
            <option value="400-1000">Price: 400-1000</option>
          </select>
      
          <input
            type="text"
            value={ownerFilter}
            onChange={handleOwnerFilter}
            placeholder="Filter by owner"
            className="border p-2 rounded text-sm md:text-base w-full sm:w-auto"
          />
      
          <input
            type="date"
            value={expiryDateFilter}
            onChange={handleExpiryDateChange}
            className="border p-2 rounded text-sm md:text-base w-full sm:w-auto"
          />
        </div>
      
        <div className="mt-4 flex justify-center">
          {filteredSlots.length > 0 ? (
            <ul className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
              {filteredSlots.map((slot, index) => (
                <li key={index} className="p-4 shadow-lg rounded-lg w-full relative bg-white">
                  <div className="p-2 flex flex-col md:flex-row gap-4 items-center md:items-start">
                    <div className="w-full md:w-1/3">
                      <img
                        src={slot.photo}
                        className="w-full h-[125px] rounded-lg object-cover"
                        alt=""
                      />
                    </div>
      
                    <div className="flex flex-col gap-2 w-full md:w-2/3">
                      <p className="text-sm lg:text-base font-bold text-slate-800">
                        Address: {slot.address}
                      </p>
                      <p className="text-sm lg:text-base font-bold text-slate-800">
                        Hourly Price: Rs.{slot.hourly_price}
                      </p>
                      <p className="text-sm lg:text-base font-bold text-slate-800">
                        Owner: {slot.owner.name}
                      </p>
                      <p className="text-sm lg:text-base font-bold text-slate-800">
                        Contact: {slot.owner.phone}
                      </p>
                      <p className="text-sm lg:text-base text-red-500">
                        Expires At: {new Date(slot.expiry_date).toLocaleString().split("G")[0]}
                      </p>
                    </div>
                  </div>
      
                  <FaLocationDot
                    className="text-xl text-red-700 absolute top-4 right-4 cursor-pointer"
                    onClick={() => handleOpenMaps(slot.latitude, slot.longitude)}
                    title="Open location in Google Maps"
                  />
      
                  <button
                    className="absolute bottom-4 right-4 bg-blue-400 px-2 py-1 rounded-full text-white font-bold text-sm md:text-base flex items-center justify-center"
                    onClick={() => toastMessage(slot)}
                  >
                    BOOK
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No slots found matching your search.</p>
          )}
        </div>
      </section>
      
    );
};

export default Services;
