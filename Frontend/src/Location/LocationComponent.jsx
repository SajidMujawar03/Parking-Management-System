// LocationComponent.js
import React from 'react';
import { FaLocationDot } from "react-icons/fa6";

const LocationComponent = ({ latitude, longitude }) => {
    const handleOpenMaps = () => {
        if (latitude && longitude) {
            const url = `https://www.google.com/maps/place/${latitude},${longitude}`;
            window.open(url, '_blank');
        }
    };

    return (
        <div>
            <FaLocationDot
                className='text-[30px] text-red-700 cursor-pointer'
                onClick={handleOpenMaps}
                title="Open location in Google Maps"
            />
        </div>
    );
};

export default LocationComponent;
