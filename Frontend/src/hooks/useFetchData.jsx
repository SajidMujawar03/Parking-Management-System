import React, { useContext, useEffect, useState, useCallback } from 'react';
import { authContext } from '../context/AuthContext.jsx';

const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useContext(authContext);

 
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null); 
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message + " 😠");
      }


      setData(result.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [url, token]); 

 
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData }; 
};

export default useFetchData;
