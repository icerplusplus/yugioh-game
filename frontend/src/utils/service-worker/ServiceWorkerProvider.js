'use client'
import React from 'react'

function ServiceWorkerProvider({children}) {
    React.useEffect(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/serviceWorker.js', { scope: '/' })
          .then((registration) => {
            console.log(
              'Service worker registered successfully. Scope:',
              registration.scope
            );
          })
          .catch((error) => {
            console.error('Service worker registration failed:', error);
          });
      }
    }, [])
  return <>
    {children}
  </>
}

export default ServiceWorkerProvider