import React, {useState, createContext, useEffect, useContext} from 'react'
import Map from '../components/Map'
import LogType from '../components/LogType'
import { getDoc, doc, updateDoc } from 'firebase/firestore'
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

    const [showLogout, setShowLogout] = useState(false)

    const [currentTrip, setCurrentTrip] = useState()

    const currentUser = useContext(UserContext)

    const checkTrips = async (trips, markers) => {
      for (let i = trips.length - 1; i > -1; i--) {
        const currentTrip = trips[i]
        const idx = markers.findIndex(marker => marker?.tripId === currentTrip.tripId)
          if (idx > -1) {
            console.log('marker exists for trip')
          } else {
            console.log('marker does not exist for this trip')
            trips.splice(i, 1)
          }
      }
      setTrips([...trips])
      await updateDoc((doc(db, 'users', currentUser)), {
        trips: [...trips]
      })
    }

    const getUserData = async () => {
      const userData = await getDoc(doc(db, 'users', currentUser))
      setMarkers([...userData.data().markers])
      const tempMarkers = [...userData.data().markers]
      const tempTrips = [...userData.data().trips]
      checkTrips(tempTrips, tempMarkers)
    }

    useEffect(() => {
      getUserData()
      setLogId()
    }, [refreshMarkers])
  

    const toggleVisibility = () => {
      setShowLogs(!showLogs)
    }

    const logout = async () => {
      await signOut(auth);
      setCurrentUser('')
  }

  const toggleLogout = () => {
    setShowLogout(!showLogout)
  }

  const handleCurrentTrip = (e) => {
    if (e.target.value === 'all') {
      setCurrentTrip()
      return
    }
    let selectedTrip = trips.filter(trip => trip.tripId === e.target.value)
    setCurrentTrip(selectedTrip)
  }

  return (
    <>  
      <MarkerContext.Provider value={markers}>

        <Map 
        setMarkerCoords={setMarkerCoords} 
        position={position} setPosition={setPosition} 
        placingMarker={placingMarker} 
        logId={logId} setLogId={setLogId}
        refreshMarkers={refreshMarkers} 
        markers={markers} setMarkers={setMarkers} setShowLogs={setShowLogs} currentTrip={currentTrip}/>

        <LogType markerCoords={markerCoords} 
        position={position} setPosition={setPosition} 
        placingMarker={placingMarker} setPlacingMarker={setPlacingMarker}
        logId={logId} setLogId={setLogId} setRefreshMarkers={setRefreshMarkers}
        showLogs={showLogs}/>
        
        
        <div className='util_buttons'>
          <select name="trips" onChange={(e) => handleCurrentTrip(e)}>
            <option value="all">All</option>
            {trips.map(trip => (
              <option key={trip.tripId} value={trip.tripId}>{trip.tripName}</option>
            ))}
          </select>
          <button onClick={toggleVisibility}><img src={showLogs ? show : hide} alt="show/hide"/></button>
          <button onClick={toggleLogout}><img src={door} alt="logout" /></button>
        </div>

        {showLogout && 
        <div className='logout_modal'>
          <button onClick={toggleLogout}>x</button>
          <p>Are you sure you want to logout?</p>
          <button onClick={logout}>Logout</button>
        </div>
      }
      </MarkerContext.Provider>
    </>
  )
}

export default MainInterface