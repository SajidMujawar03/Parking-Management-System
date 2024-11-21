import React, { useContext, useEffect, useState, useCallback } from 'react';
import { authContext } from '../context/AuthContext.jsx';

const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useContext(authContext);

  // Define the fetchData function
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null); // Reset error state on refetch
    try {
      console.log(url, "  ", token);
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message + " 😠");
      }

      console.log(result.data);
      setData(result.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [url, token]); // Dependencies for the useCallback hook

  // Use fetchData when the component mounts or URL changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData }; // Return refetch as part of the hook's result
};

export default useFetchData;
