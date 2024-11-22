// LocationFinder.js
import React, { useEffect, useState } from 'react';
import LocationComponent from './LocationComponent';


const BASE_URL = import.meta.env.VITE_BASE_URL;


const LocationFinder = () => {
    const [slots, setSlots] = useState([]);

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
        } catch (error) {
            console.error("Error fetching slots:", error);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    return (
        <div>
            {slots.length > 0 ? (
                slots.map((slot, index) => (
                    <div key={index} className="slot-item">
                        <h2>{slot.address}</h2>
                        <LocationComponent latitude={slot.latitude} longitude={slot.longitude} />
                    </div>
                ))
            ) : (
                <p>No locations available.</p>
            )}
        </div>
    );
};

export default LocationFinder;
