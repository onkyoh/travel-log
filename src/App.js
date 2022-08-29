import React, { useState, useEffect, createContext} from 'react';
import MainInterface from './screens/MainInterface';
import Login from './screens/Login';
import './styles/App.css';
import { auth } from './firebase-config';
import { onAuthStateChanged } from "firebase/auth";

export const UserContext = createContext();

function App() {

  const [currentUser, setCurrentUser] = useState("")

  const [loadingUser, setLoadingUser] = useState(true)

    onAuthStateChanged (auth, (retrievedUser) => {
      if (retrievedUser) {
        setCurrentUser(() => retrievedUser.uid)
      } else {
       console.log("No previous user found") 
      }
      setLoadingUser(false)
    })

  return (
    <div className='app'>
      {loadingUser ?
        <>
          <div className='spinner'></div>
        </>
      :
        <>
          {currentUser ? 
            <UserContext.Provider value={currentUser}>
              <MainInterface setCurrentUser={setCurrentUser}/>
            </UserContext.Provider>
            :
            <Login setCurrentUser={setCurrentUser}/>
          }
        </>
      }
    </div>
  );
}

export default App;
