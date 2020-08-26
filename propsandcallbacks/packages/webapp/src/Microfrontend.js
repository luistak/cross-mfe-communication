import React, { useRef, useCallback, useEffect } from 'react';

import './Microfrontend.css';

export default function Microfrontend({ microfrontend, customProps }) {
  const microfrontendRef = useRef();

  console.log({ CYPY: customProps });

  const renderMicrofrontendView = useCallback(() => {
    if (microfrontendRef.current) {
      microfrontend.view(microfrontendRef.current, customProps);
    }
  }, [microfrontend, customProps, microfrontendRef])

  useEffect(renderMicrofrontendView)

  if (!microfrontendRef) {
    return null;
  }

  return (
    <section id={microfrontend.packageName} className="Microfrontend">
      <section className="Microfrontend-container">
        <div className="Microfrontend-view" ref={microfrontendRef} />
      </section>
    </section>
  )
};
