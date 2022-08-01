import React, {useState, createContext} from 'react'
import Contacts from '../components/Contacts'
import Map from '../components/Map'
import LogType from '../components/LogType'

export const MarkerContext = createContext()

const MainInterface = () => {

    const showContacts = false

    const [markerCoords, setMarkerCoords] = useState([]) 

    const [position, setPosition] = useState(null)

    const [placingMarker, setPlacingMarker] = useState(false)

    const [logId, setLogId] = useState("")

    const [refreshMarkers, setRefreshMarkers] = useState(0)

    const [markers, setMarkers] = useState([])
  
  return (
    <>  
      <MarkerContext.Provider value={markers}>
        <Map 
        setMarkerCoords={setMarkerCoords} 
        position={position} setPosition={setPosition} 
        placingMarker={placingMarker} setLogId={setLogId}
        refreshMarkers={refreshMarkers} 
        markers={markers} setMarkers={setMarkers}/>

        {showContacts && <Contacts/>}

        <LogType markerCoords={markerCoords} 
        position={position} setPosition={setPosition} 
        placingMarker={placingMarker} setPlacingMarker={setPlacingMarker}
        logId={logId} 
        refreshMarkers={refreshMarkers} setRefreshMarkers={setRefreshMarkers}/>
      </MarkerContext.Provider>
    </>
  )
}

export default MainInterface