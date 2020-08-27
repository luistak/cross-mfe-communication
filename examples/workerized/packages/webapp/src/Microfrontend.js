import React, { useRef, useCallback, useEffect } from 'react';

import './Microfrontend.css';

export default function Microfrontend({ microfrontend }) {
  const microfrontendRef = useRef();

  const renderMicrofrontendView = useCallback(() => {
    if (microfrontendRef.current) {
      microfrontend.view(microfrontendRef.current);
    }
  }, [microfrontend, microfrontendRef])

  useEffect(renderMicrofrontendView, [microfrontendRef])

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
