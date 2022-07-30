import React, { useState, useEffect, createContext} from 'react';
import MainInterface from './screens/MainInterface';
import Login from './screens/Login';
import './styles/App.css';
import { auth } from './firebase-config';
import { onAuthStateChanged } from "firebase/auth";

export const UserContext = createContext();

function App() {

  const [currentUser, setCurrentUser] = useState("")

  useEffect(() => {
    onAuthStateChanged (auth, (retrievedUser) => {
      if (retrievedUser) {
        setCurrentUser(retrievedUser.uid)
      } else {
       console.log("No previous user found") 
      }
    })
  }, [])

  return (
    <div className='app'>
          {currentUser ? 
          <UserContext.Provider value={currentUser}>
            <MainInterface/>
          </UserContext.Provider>
          :
          <Login setCurrentUser={setCurrentUser}/>
          }
    </div>
  );
}

export default App;
