import { useEffect, useState, useRef } from 'react';

const useGoogleMapsLoader = (apiKey: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isScriptAdded = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.google && !isScriptAdded.current) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.onload = () => {
          console.log('Google Maps API loaded');
          setIsLoaded(true);
        };
        script.onerror = () => {
          console.error('Error loading Google Maps API');
          setIsLoaded(false);
        };
        document.head.appendChild(script);
        isScriptAdded.current = true;
      } else if (window.google) {
        setIsLoaded(true);
      }
    }
  }, [apiKey]);

  return isLoaded;
};

export default useGoogleMapsLoader;
