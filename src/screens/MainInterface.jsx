import React, {useState} from 'react'
import Contacts from '../components/Contacts'
import Map from '../components/Map'
import LogType from '../components/LogType'

const MainInterface = () => {

    const showContacts = false

    const [markerCoords, setMarkerCoords] = useState([]) 

    const [position, setPosition] = useState(null)

    const [placingMarker, setPlacingMarker] = useState(false)

  return (
    <>
        <Map setMarkerCoords={setMarkerCoords} position={position} setPosition={setPosition} placingMarker={placingMarker}/>
        {showContacts && <Contacts/>}
        <LogType markerCoords={markerCoords} position={position} setPosition={setPosition} placingMarker={placingMarker} setPlacingMarker={setPlacingMarker}/>
    </>
  )
}

export default MainInterface