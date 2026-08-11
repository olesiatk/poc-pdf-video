import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { sendRouting } from '../postMessage';

export function RouteBridge() {
  const location = useLocation();

  useEffect(() => {
    sendRouting(location.pathname + location.search);
  }, [location]);

  return null;
}
