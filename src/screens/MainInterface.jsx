import React, {useState, createContext, useEffect, useContext} from 'react'
import Contacts from '../components/Contacts'
import Map from '../components/Map'
import LogType from '../components/LogType'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase-config'
import { UserContext } from '../App'


export const MarkerContext = createContext()

const MainInterface = () => {

    const [showContacts, setShowContacts] = useState(true)

    const [showLogs, setShowLogs] = useState(true)

    const [markerCoords, setMarkerCoords] = useState([]) 

    const [position, setPosition] = useState(null)

    const [placingMarker, setPlacingMarker] = useState(false)

    const [logId, setLogId] = useState("")

    const [refreshMarkers, setRefreshMarkers] = useState(0)

    const [markers, setMarkers] = useState([])

    const currentUser = useContext(UserContext)

    const getMarkers = async () => {
      const markerData = await getDoc(doc(db, 'users', currentUser))
      setMarkers([...markerData.data().markers])
    }

    useEffect(() => {
      getMarkers()
    }, [refreshMarkers])
  
    const toggleContacts = () => {
      setShowContacts(!showContacts)
    }
    
    const toggleLogs = () => {
      setShowLogs(!showLogs)
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

        <Contacts showContacts={showContacts}/>

        <LogType markerCoords={markerCoords} 
        position={position} setPosition={setPosition} 
        placingMarker={placingMarker} setPlacingMarker={setPlacingMarker}
        logId={logId} 
        refreshMarkers={refreshMarkers} setRefreshMarkers={setRefreshMarkers}
        showLogs={showLogs}/>
        
        <div className='util_buttons'>
          <button onClick={toggleContacts}>O</button>
          <div>trips</div>
          <button onClick={toggleLogs}>N</button>
        </div>
      </MarkerContext.Provider>
    </>
  )
}

export default MainInterface