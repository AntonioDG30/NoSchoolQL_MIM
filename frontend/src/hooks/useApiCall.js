import {useApp} from '../context/AppContext';
import {useCallback} from 'react';

const useApiCall = () => {
  const { setLoading, setError } = useApp();
  
  const execute = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  return execute;
};

export default useApiCall;