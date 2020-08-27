/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Observable } from 'windowed-observable';
import './App.css';

const observable = new Observable('messages');

function App() {
  const [messages, setMessages] = useState([]);

  const handleNewMessage = (newMessage) => {
    setMessages((currentMessages) => currentMessages.concat(newMessage));
  };

  useEffect(() => {  
    observable.subscribe(handleNewMessage);

    return () => {
      observable.unsubscribe(handleNewMessage)
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
