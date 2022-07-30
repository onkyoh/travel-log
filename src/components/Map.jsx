import React, {useState, useEffect} from 'react'
import { MapContainer, TileLayer, Marker} from 'react-leaflet'
import Leaflet from 'leaflet'
import CreateMarker from './CreateMarker'
import { db } from '../firebase-config'
import { doc, getDoc } from '@firebase/firestore'

const Map = ({position, setPosition, placingMarker}) => {


  const [userTrips, setUserTrips] = useState([])
  const [markers, setMarkers] = useState([])

  const getMarkers = async () => {
    const fetchMarkers = await getDoc(doc(db, 'users', '66TmP6Vr7jDKbSA5a47a'))
    setMarkers([...fetchMarkers.data().markers])
  }

  const tripMarkers = Leaflet.divIcon({
    className: 'trip_marker',
    iconSize: [30, 30],
    backgroundColor: 'red'
  })

  useEffect(() => {
      //will get usersMakers from firebase
      getMarkers()      
  }, [])

  const openLog = (id) => {
    //go to firebase  
    console.log(id)
  }
  
  return (
    <MapContainer className='map' center={[51.505, -0.09]} zoom={5}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers && markers.map((marker) => (
            <Marker key={marker.id} position={marker.coordinates} icon={tripMarkers} eventHandlers={{
              click: () => openLog(marker.id),
            }}/>
        ))}
        <CreateMarker position={position} setPosition={setPosition} placingMarker={placingMarker}/>
    </MapContainer>
  )
}

export default Map