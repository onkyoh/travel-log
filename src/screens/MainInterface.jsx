import React, {useState, createContext, useEffect, useContext} from 'react'
import Contacts from '../components/Contacts'
import Map from '../components/Map'
import LogType from '../components/LogType'
import { getDoc, doc } from 'firebase/firestore'
import { db, auth } from '../firebase-config'
import { signOut } from "firebase/auth";
import { UserContext } from '../App'


export const MarkerContext = createContext()

const MainInterface = ({setCurrentUser}) => {

    const [showContacts, setShowContacts] = useState(true)

    const [showLogs, setShowLogs] = useState(true)

    const [markerCoords, setMarkerCoords] = useState([]) 

    const [position, setPosition] = useState(null)

    const [placingMarker, setPlacingMarker] = useState(false)

    const [logId, setLogId] = useState("")

    const [refreshMarkers, setRefreshMarkers] = useState(0)

    const [markers, setMarkers] = useState([])

    const [togglingAsides, setTogglingAsides] = useState(false)

    const currentUser = useContext(UserContext)

    const getMarkers = async () => {
      const markerData = await getDoc(doc(db, 'users', currentUser))
      setMarkers([...markerData.data().markers])
    }

    useEffect(() => {
      getMarkers()
    }, [refreshMarkers])
  
    const toggleAsides = () => {
      setTogglingAsides(!togglingAsides)
      setShowContacts(true)
      setShowLogs(true)
    }

    const toggleVisibility = () => {
      if (togglingAsides) {
        setShowContacts(!showContacts)
      } else {
        setShowLogs(!showLogs)
      }
    }

    const logout = async () => {
      await signOut(auth);
      setCurrentUser('')
  }

  return (
    <>  
      <MarkerContext.Provider value={markers}>

      <button className='logout_button' onClick={logout}>LOGOUT</button>

        <Map 
        setMarkerCoords={setMarkerCoords} 
        position={position} setPosition={setPosition} 
        placingMarker={placingMarker} setLogId={setLogId}
        refreshMarkers={refreshMarkers} 
        markers={markers} setMarkers={setMarkers}/>

        {togglingAsides ? 
        <Contacts showContacts={showContacts}/>
        :
        <LogType markerCoords={markerCoords} 
        position={position} setPosition={setPosition} 
        placingMarker={placingMarker} setPlacingMarker={setPlacingMarker}
        logId={logId} 
        refreshMarkers={refreshMarkers} setRefreshMarkers={setRefreshMarkers}
        showLogs={showLogs}/>
        }
        
        <div className='util_buttons'>
          <div>trips select</div>
          <button onClick={toggleAsides}>Switch</button>
          <button onClick={toggleVisibility}>Hide</button>
        </div>
      </MarkerContext.Provider>
    </>
  )
}

export default MainInterface