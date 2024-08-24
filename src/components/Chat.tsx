import React, { useState, useEffect, useRef } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { auth, db } from "../firebase-config";

const Chat = (props) => {
  const { room } = props;

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesRef = collection(db, "messages"); // referencing "messages" collection in the firebase DB. we pass in the db object created in firebase-config

  // to 'listen' to the server for chat updates:
  useEffect(() => {
    // only query for messages where the room is the same.
    const queryMessages = query(messagesRef, where("room", "==", room), orderBy("createdAt"));

    // onSnapshot sets up a real-time listener for the query. It will trigger the callback function every time there's a change in queryMessages.
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        // iterate over each document in the snapshot, here the snapshot is queryMessages
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
      scrollToBottom();
    });

    return () => unsubscribe(); // cleanup function
  }, [room]);

  const handleSubmit = async (e) => {
    // submitting messages to firebase
    e.preventDefault();
    if (newMessage === "") return;

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(), // keep timestamp
      user: auth.currentUser?.displayName,
      room: room,
    }); // add message to collection

    setNewMessage(""); // empty the input
    console.log(messages);
  };

  // Handle scrolling to bottom after messages are added
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-container">
      <div className="room-name">
        <h1>Room: {room}</h1>
      </div>
      <ul className="messages-container">
        {messages.map((message, key) => {
          const isCurrentUser = message.user === auth.currentUser?.displayName;
          console.log(isCurrentUser);
          return (
            <div className="flex flex-row items-center">
              <p className={`time-sent ${isCurrentUser ? "sent-time" : "received"}`}> {formatTime(message.createdAt)}:&nbsp;&nbsp; </p>
              <li key={key} className={isCurrentUser ? "sent" : "received"}>
                  {!isCurrentUser && (
                    <p className="message-name">
                      {message.user}&nbsp;&nbsp;
                    </p>
                  )}
                  
                {message.text}
              </li>

            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </ul>
      <form onSubmit={handleSubmit} className="new-message-form">
        <input
          className="new-message-input"
          placeholder="Type your message here.."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)} // Handles updating the input value
        />
        <button type="submit" className="send-button">
          Send
        </button>
        {/* since the submit button is of type='submit', the form onSubmit will be called. */}
      </form>
    </div>
  );
};

export default Chat;
