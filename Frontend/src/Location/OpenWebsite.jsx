// OpenWebsite.js
import React from 'react';

const OpenWebsite = ({ latitude, longitude }) => {
    const handleOpenMaps = () => {
        if (latitude && longitude) {
            const url = `https://www.google.com/maps/place/${latitude},${longitude}`;
            window.open(url, '_blank');
        }
    };

    return (
        <div>
            <button onClick={handleOpenMaps} className="bg-blue-500 text-white px-4 py-2 rounded">
                Open Maps
            </button>
        </div>
    );
};

export default OpenWebsite;
