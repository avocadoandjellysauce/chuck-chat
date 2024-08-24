import React, { useState, useRef, useEffect } from "react";
import Auth from "./components/Auth";
import Cookies from "universal-cookie";
import Chat from "./components/Chat";
import {auth} from './firebase-config'
import { signOut } from "firebase/auth";

const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(null);
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const roomInputRef = useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authToken = cookies.get("auth-token");
      setIsAuth(!!authToken);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setRoom(roomInputRef.current.value);
    }
  };

  const handleEnterRoom = () => {
    setRoom(roomInputRef.current.value);
  };

  const signUserOut = async () => {
    await signOut(auth)
    cookies.remove("auth-token")
    setIsAuth(false)
    setRoom(null)
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return <Auth setIsAuth={setIsAuth} />;
  }

  return (
    <div>
      <h1 className="chuck-chat-title">Chuck Chat</h1>  
      {room ? (
        <Chat room={room} />
      ) : (
        <div className="room-input flex flex-col items-center">
          <p className="mt-10">Enter room ID</p>
          <input 
            className='my-5 w-60' 
            ref={roomInputRef} 
            onKeyDown={handleKeyDown}
          /> 
          <button onClick={handleEnterRoom} className="enter-room-btn">Enter room</button>
        </div>
      )}

      <div className="sign-out">
        <button className="sign-out-btn" onClick={signUserOut}>Sign out</button>
      </div>
    </div>
  );
}

export default App;