import React, {useState, createContext, useEffect, useContext} from 'react'
import Map from '../components/Map'
import LogType from '../components/LogType'
import { getDoc, doc } from 'firebase/firestore'
import { db, auth } from '../firebase-config'
import { signOut } from "firebase/auth";
import { UserContext } from '../App'
import show from '../icons/show.png'
import hide from '../icons/hide.png'
import door from '../icons/door.png'


export const MarkerContext = createContext()

const MainInterface = ({setCurrentUser}) => {

    const [showLogs, setShowLogs] = useState(true)

    const [markerCoords, setMarkerCoords] = useState([]) 

    const [position, setPosition] = useState(null)

    const [placingMarker, setPlacingMarker] = useState(false)

    const [logId, setLogId] = useState("")

    const [refreshMarkers, setRefreshMarkers] = useState(0)

    const [markers, setMarkers] = useState([])

    const [trips, setTrips] = useState([])

    const currentUser = useContext(UserContext)

    const getUserData = async () => {
      const userData = await getDoc(doc(db, 'users', currentUser))
      setMarkers([...userData.data().markers])
      setTrips([...userData.data().trips])
    }

    useEffect(() => {
      getUserData()
    }, [refreshMarkers])
  

    const toggleVisibility = () => {
      setShowLogs(!showLogs)
    }

    const logout = async () => {
      await signOut(auth);
      setCurrentUser('')
  }

  return (
    <>  
      <MarkerContext.Provider value={markers}>

        <Map 
        setMarkerCoords={setMarkerCoords} 
        position={position} setPosition={setPosition} 
        placingMarker={placingMarker} setLogId={setLogId}
        refreshMarkers={refreshMarkers} 
        markers={markers} setMarkers={setMarkers}/>

        <LogType markerCoords={markerCoords} 
        position={position} setPosition={setPosition} 
        placingMarker={placingMarker} setPlacingMarker={setPlacingMarker}
        logId={logId} 
        refreshMarkers={refreshMarkers} setRefreshMarkers={setRefreshMarkers}
        showLogs={showLogs}/>
        
        
        <div className='util_buttons'>
          <select name="trips">
            <option value="'all">All</option>
            {trips.map(trip => (
              <option value={trip.tripId}>{trip.tripName}</option>
            ))}
          </select>
          <button onClick={toggleVisibility}><img src={showLogs ? show : hide} alt="show/hide"/></button>
          <button onClick={logout}><img src={door} alt="logout" /></button>
        </div>
      </MarkerContext.Provider>
    </>
  )
}

export default MainInterface