import React, {useState, useEffect, useContext} from 'react'
import { MapContainer, TileLayer, Marker} from 'react-leaflet'
import Leaflet from 'leaflet'
import CreateMarker from './CreateMarker'
import { db } from '../firebase-config'
import { doc, getDoc } from '@firebase/firestore'
import {UserContext } from '../App'

const Map = ({position, setPosition, placingMarker, setLogId, refreshMarkers}) => {

  const currentUser = useContext(UserContext)

  const [userTrips, setUserTrips] = useState([])
  const [markers, setMarkers] = useState([])

  const getMarkers = async () => {
    const fetchMarkers = await getDoc(doc(db, 'users', currentUser))
    setMarkers([...fetchMarkers.data().markers])
    console.log(fetchMarkers.data().markers)
  }

  const markerIcons = Leaflet.divIcon({
    className: 'trip_marker',
    iconSize: [30, 30],
  })

  useEffect(() => {
      //will get usersMakers from firebase
      if (refreshMarkers === 0) {
        getMarkers() 
      } else {
        setTimeout(() => {
          getMarkers()
        }, 1000)
      }  
  }, [refreshMarkers])

  const openLog = (id) => {
    //go to firebase  
    console.log(id)
    setLogId(id)
  }
  
  return (
    <MapContainer className='map' center={[51.505, -0.09]} zoom={5}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers && markers.map((marker) => (
            <Marker key={marker.id} position={marker.coordinates} icon={markerIcons} eventHandlers={{
              click: () => openLog(marker.id),
            }}/>
        ))}
        <CreateMarker position={position} setPosition={setPosition} placingMarker={placingMarker}/>
    </MapContainer>
  )
}

export default Map