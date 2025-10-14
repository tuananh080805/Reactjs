import { useState, useCallback } from 'react';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, response };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url) => request(url), [request]);
  
  const post = useCallback((url, body) => 
    request(url, {
      method: 'POST',
      body: JSON.stringify(body),
    }), [request]);

  const put = useCallback((url, body) => 
    request(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    }), [request]);

  const del = useCallback((url) => 
    request(url, {
      method: 'DELETE',
    }), [request]);

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del,
  };
};

export default useApi;