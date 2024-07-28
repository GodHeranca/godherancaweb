import { useEffect } from 'react';

const useGoogleMapsLoader = (apiKey: string) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.onload = () => {
          console.log('Google Maps API loaded');
        };
        document.head.appendChild(script);
      }
    }
  }, [apiKey]);

  return typeof window !== 'undefined' && window.google;
};

export default useGoogleMapsLoader;
