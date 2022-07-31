import React, {useState} from 'react'
import Contacts from '../components/Contacts'
import Map from '../components/Map'
import LogType from '../components/LogType'

const MainInterface = () => {

    const showContacts = false

    const [markerCoords, setMarkerCoords] = useState([]) 

    const [position, setPosition] = useState(null)

    const [placingMarker, setPlacingMarker] = useState(false)

    const [logId, setLogId] = useState("")

    const [refreshMarkers, setRefreshMarkers] = useState(0)

  return (
    <>
        <Map 
        setMarkerCoords={setMarkerCoords} 
        position={position} setPosition={setPosition} 
        placingMarker={placingMarker} setLogId={setLogId}
        refreshMarkers={refreshMarkers}/>

        {showContacts && <Contacts/>}

        <LogType markerCoords={markerCoords} 
        position={position} setPosition={setPosition} 
        placingMarker={placingMarker} setPlacingMarker={setPlacingMarker}
        logId={logId} 
        refreshMarkers={refreshMarkers} setRefreshMarkers={setRefreshMarkers}/>
    </>
  )
}

export default MainInterface