import React, { useEffect, useState } from 'react';
import './App.css';

// import worky from 'worky';
const { worky } = window;

function App() {
  const [messages, setMessages] = useState([]);

  const handleNewMessage = (message) => {
    if (message.data.type) {
      return;
    }

    setMessages((currentMessages) => currentMessages.concat(message.data));
  };

  useEffect(() => {  
    worky.addEventListener('message', handleNewMessage);

    return () => {
      worky.removeEventListener('message', handleNewMessage)
    }
  }, [handleNewMessage]);


  return (
    <div className="MF">
      <h3>Microfrontend 1️⃣</h3>
      <p>New messages will be displayed below 👇</p>
      <div className="MF__messages">
        {messages.map((something, i) => <p key={something + i}>{something}</p>)}
      </div>
    </div>
  );

}

export default App;
