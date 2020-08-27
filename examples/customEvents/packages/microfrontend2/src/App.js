/* eslint-disable */
import React from 'react';

function App({ onNewMessage }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    const { target: form } = e;
    const input = form?.elements?.something;
    
    const customEvent = new CustomEvent('message', { detail: input.value });
    window.dispatchEvent(customEvent)
    form.reset();
  }

  return (
    <div className="MF">
      <h3>Microfrontend 2️⃣</h3>
      <p>⌨️ Use this form to communicate with the other microfrontend</p>
      <form onSubmit={handleSubmit}>
        <input type="text" name="something" placeholder="Type something in here"/>
        <button type="submit">Communicate!</button>
      </form>
    </div>
  );
}

export default App;
