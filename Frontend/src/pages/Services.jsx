// import React, { useContext, useEffect, useState } from 'react';
// import { FaSearch } from "react-icons/fa";
// import { BASE_URL } from '../config';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaLocationDot } from "react-icons/fa6";
// import Fuse from 'fuse.js';
// import { authContext } from '../context/AuthContext'
// import { toast } from 'react-toastify';

// const Services = () => {
//     const [slots, setSlots] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [filteredSlots, setFilteredSlots] = useState([]);
//     const [priceRange, setPriceRange] = useState([0, 1000]); // Price range filter
//     const [ownerFilter, setOwnerFilter] = useState('');
//     const [expiryDateFilter, setExpiryDateFilter] = useState(''); // Filter by expiry date
    
//     const {user} = useContext(authContext)
//     const navigate = useNavigate();

//     // Fetch slots from the API
//     const fetchSlots = async () => {
//         try {
//             const response = await fetch(`${BASE_URL}/slot/slots`, {
//                 method: 'get',
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//             });
//             const data = await response.json();
//             if (!response.ok) {
//                 throw new Error(`Error: ${response.status} ${response.statusText}`);
//             }
//             setSlots(data.slots);
//             setFilteredSlots(data.slots);  // Initially show all slots
//         } catch (error) {
//             console.error("Error fetching slots:", error);
//         }
//     };

//     useEffect(() => {
//         fetchSlots();
//     }, []);

//     // Handle the search input change
//     const handleSearchInput = (e) => {
//         setSearchQuery(e.target.value);
//     };

//     // Handle price range filter change
//     const handlePriceChange = (e) => {
//         const [min, max] = e.target.value.split('-');
//         setPriceRange([parseInt(min), parseInt(max)]);
//     };

//     // Handle owner name filter
//     const handleOwnerFilter = (e) => {
//         setOwnerFilter(e.target.value);
//     };

//     // Handle expiry date filter change
//     const handleExpiryDateChange = (e) => {
//         setExpiryDateFilter(e.target.value);
//     };

//     // Perform complex filtering with Fuse.js
//     const handleSearch = (e) => {
//         e.preventDefault();

//         let filtered = slots;

//         // Apply Fuse.js for fuzzy search
//         if (searchQuery) {
//             const fuse = new Fuse(filtered, {
//                 keys: ['address', 'owner.name'], // Search in address and owner name
//                 includeScore: true,
//                 threshold: 0.4, // Threshold for fuzzy match (lower = more strict)
//             });
//             filtered = fuse.search(searchQuery).map(result => result.item); // Get matched slots
//         }

//         // Filter by price range
//         if (priceRange) {
//             filtered = filtered.filter(slot => slot.hourly_price >= priceRange[0] && slot.hourly_price <= priceRange[1]);
//         }

//         // Filter by owner name
//         if (ownerFilter) {
//             filtered = filtered.filter(slot => slot.owner.name.toLowerCase().includes(ownerFilter.toLowerCase()));
//         }

//         // Filter by expiry date
//         if (expiryDateFilter) {
//             filtered = filtered.filter(slot => {
//                 const expiryDate = new Date(slot.expiry_date);
//                 const filterDate = new Date(expiryDateFilter);
//                 return expiryDate.setHours(0, 0, 0, 0) === filterDate.setHours(0, 0, 0, 0);
//             });
//         }

//         setFilteredSlots(filtered);
//     };

//     // Handler to open Google Maps with the slot's latitude and longitude
//     const handleOpenMaps = (latitude, longitude) => {
//         if (latitude && longitude) {
//             const url = `https://www.google.com/maps/place/${latitude},${longitude}`;
//             window.open(url, '_blank');
//         }
//     };

//     const toastMessage = (slot) => {
//         (user && user.role === 'user') ? toast.success(`Hi ${user.name}!!`) : toast.error("Only Visitors can Book")
//         user.role === 'user' ? navigate(`/booking/${slot._id}`) : navigate('/login')
//     }

//     return (
//         <>
//             <section className='h-fit'>
//                 <form onSubmit={handleSearch} className='container flex items-center justify-center'>
//                     <div className='shadow-custom-shadow w-[60%] rounded-full flex'>
//                         <input
//                             type="text"
//                             value={searchQuery}
//                             onChange={handleSearchInput}
//                             className='w-3/4 h-[50px] rounded-l-full px-[20px] focus:outline-none'
//                             placeholder="Search by address or owner"
//                         />
//                         <button
//                             type="submit"
//                             className='bg-orange-400 w-1/4 rounded-r-full font-bold text-white text-[18px] flex items-center justify-center gap-1'
//                         >
//                             <FaSearch />
//                             <span>Search</span>
//                         </button>
//                     </div>
//                 </form>

//                 <div className="mt-8 container flex justify-center gap-5">
//                     {/* Price Range Filter */}
//                     <select onChange={handlePriceChange} className="border p-2 rounded">
//                         <option value="0-1000">Price: All</option>
//                         <option value="0-200">Price: 0-200</option>
//                         <option value="200-400">Price: 200-400</option>
//                         <option value="400-1000">Price: 400-1000</option>
//                     </select>

//                     {/* Owner Filter */}
//                     <input
//                         type="text"
//                         value={ownerFilter}
//                         onChange={handleOwnerFilter}
//                         placeholder="Filter by owner"
//                         className="border p-2 rounded"
//                     />

//                     {/* Expiry Date Filter */}
//                     <input
//                         type="date"
//                         value={expiryDateFilter}
//                         onChange={handleExpiryDateChange}
//                         className="border p-2 rounded"
//                     />
//                 </div>

//                 <div className="container mt-8 flex justify-center">
//                     {filteredSlots.length > 0 ? (
//                         <ul className='w-[75%] h-fit grid grid-cols-1 place-items-center'>
//                             {filteredSlots.map((slot, index) => (
//                                 <li key={index} className="p-2 shadow-lg mb-4 rounded-lg w-3/4 h-fit relative">
//                                     <div className="p-2 flex items-center justify-start border-solid border-orange-200">
//                                         <div className='flex gap-3 w-full relative'>
//                                             <div className='w-[250px] h-[125px]'>
//                                                 <img src={slot.photo} className='w-[250px] h-[125px] rounded-[5px]' alt="" />
//                                             </div>

//                                             <div className='w-[300px]'>
//                                                 <p className='text-[14px] lg:text-[20px] text-slate-800 font-700 mt-0'>
//                                                     Address : {slot.address}</p>
//                                                 <p className='text-[14px] lg:text-[20px] text-slate-800 font-700 mt-0'>
//                                                     Hourly Price : Rs.{slot.hourly_price}
//                                                 </p>

//                                                 <div>
//                                                     <p className='text-[14px] lg:text-[20px] text-slate-800 font-700 mt-0'>
//                                                         Owner : {slot.owner.name}
//                                                     </p>
//                                                     <p className='text-[14px] lg:text-[20px] text-slate-800 font-700 mt-0'>
//                                                         Contact : {slot.owner.phone}
//                                                     </p>
//                                                     <p className='text-red-500'>
//                                                         Expires At : {new Date(slot.expiry_date).toLocaleString().split('G')[0]}
//                                                     </p>
//                                                 </div>
//                                             </div>

//                                             <FaLocationDot
//                                                 className='text-[30px] text-red-700 absolute right-0 top-0 cursor-pointer'
//                                                 onClick={() => handleOpenMaps(slot.latitude, slot.longitude)}
//                                                 title="Open location in Google Maps"
//                                             />

//                                             <button className='absolute bottom-0 right-0 bg-blue-400 h-[40px] w-[75px] rounded-full text-white font-bold text-center flex items-center justify-center' onClick={() => toastMessage(slot)}>
//                                                 BOOK
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p>No slots found matching your search.</p>
//                     )}
//                 </div>
//             </section>
//         </>
//     );
// };

// export default Services;






import React, { useContext, useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
// import { BASE_URL } from '../config';
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
    const [priceRange, setPriceRange] = useState([0, 1000]); // Price range filter
    const [ownerFilter, setOwnerFilter] = useState('');
    const [expiryDateFilter, setExpiryDateFilter] = useState(''); // Filter by expiry date
    
    const {user} = useContext(authContext)
    const navigate = useNavigate();

    // Fetch slots from the API
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
            setFilteredSlots(data.slots);  // Initially show all slots
        } catch (error) {
            console.error("Error fetching slots:", error);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    // Handle the search input change
    const handleSearchInput = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle price range filter change
    const handlePriceChange = (e) => {
        const [min, max] = e.target.value.split('-');
        setPriceRange([parseInt(min), parseInt(max)]);
    };

    // Handle owner name filter
    const handleOwnerFilter = (e) => {
        setOwnerFilter(e.target.value);
    };

    // Handle expiry date filter change
    const handleExpiryDateChange = (e) => {
        setExpiryDateFilter(e.target.value);
    };

    // Perform complex filtering with Fuse.js
    const handleSearch = (e) => {
        e.preventDefault();

        let filtered = slots;

        // Apply Fuse.js for fuzzy search
        if (searchQuery) {
            const fuse = new Fuse(filtered, {
                keys: ['address', 'owner.name'], // Search in address and owner name
                includeScore: true,
                threshold: 0.4, // Threshold for fuzzy match (lower = more strict)
            });
            filtered = fuse.search(searchQuery).map(result => result.item); // Get matched slots
        }

        // Filter by price range
        if (priceRange) {
            filtered = filtered.filter(slot => slot.hourly_price >= priceRange[0] && slot.hourly_price <= priceRange[1]);
        }

        // Filter by owner name
        if (ownerFilter) {
            filtered = filtered.filter(slot => slot.owner.name.toLowerCase().includes(ownerFilter.toLowerCase()));
        }
       

        // Filter by expiry date
        if (expiryDateFilter) {
            filtered = filtered.filter(slot => {
                const expiryDate = new Date(slot.expiry_date);
                const filterDate = new Date(expiryDateFilter);
                console.log(expiryDate,filterDate)
                return expiryDate >= filterDate; // Only show slots with expiry date greater than or equal to the selected date
            });
        }

        setFilteredSlots(filtered);
    };

    // Handler to open Google Maps with the slot's latitude and longitude
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
        <>
            <section className='h-fit'>
                <form onSubmit={handleSearch} className='container flex items-center justify-center'>
                    <div className='shadow-custom-shadow w-[60%] rounded-full flex'>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchInput}
                            className='w-3/4 h-[50px] rounded-l-full px-[20px] focus:outline-none'
                            placeholder="Search by address or owner"
                        />
                        <button
                            type="submit"
                            className='bg-orange-400 w-1/4 rounded-r-full font-bold text-white text-[18px] flex items-center justify-center gap-1'
                        >
                            <FaSearch />
                            <span>Search</span>
                        </button>
                    </div>
                </form>

                <div className="mt-8 container flex justify-center gap-5">
                    {/* Price Range Filter */}
                    <select onChange={handlePriceChange} className="border p-2 rounded">
                        <option value="0-1000">Price: All</option>
                        <option value="0-200">Price: 0-200</option>
                        <option value="200-400">Price: 200-400</option>
                        <option value="400-1000">Price: 400-1000</option>
                    </select>

                    {/* Owner Filter */}
                    <input
                        type="text"
                        value={ownerFilter}
                        onChange={handleOwnerFilter}
                        placeholder="Filter by owner"
                        className="border p-2 rounded"
                    />

                    {/* Expiry Date Filter */}
                    <input
                        type="date"
                        value={expiryDateFilter}
                        onChange={handleExpiryDateChange}
                        className="border p-2 rounded"
                    />
                </div>

                <div className="container mt-8 flex justify-center">
                    {filteredSlots.length > 0 ? (
                        <ul className='w-[75%] h-fit grid grid-cols-1 place-items-center'>
                            {filteredSlots.map((slot, index) => (
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
                                                    <p className='text-red-500'>
                                                        Expires At : {new Date(slot.expiry_date).toLocaleString().split('G')[0]}
                                                    </p>
                                                </div>
                                            </div>

                                            <FaLocationDot
                                                className='text-[30px] text-red-700 absolute right-0 top-0 cursor-pointer'
                                                onClick={() => handleOpenMaps(slot.latitude, slot.longitude)}
                                                title="Open location in Google Maps"
                                            />

                                            <button className='absolute bottom-0 right-0 bg-blue-400 h-[40px] w-[75px] rounded-full text-white font-bold text-center flex items-center justify-center' onClick={() => toastMessage(slot)}>
                                                BOOK
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No slots found matching your search.</p>
                    )}
                </div>
            </section>
        </>
    );
};

export default Services;
