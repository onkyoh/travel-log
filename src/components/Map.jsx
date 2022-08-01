import React, {useState, useEffect, useContext} from 'react'
import { MapContainer, TileLayer, Marker} from 'react-leaflet'
import Leaflet from 'leaflet'
import CreateMarker from './CreateMarker'
import { db } from '../firebase-config'
import { doc, getDoc } from '@firebase/firestore'
import {UserContext } from '../App'

const Map = ({position, setPosition, placingMarker, setLogId, refreshMarkers, setMarkers, markers}) => {

  const currentUser = useContext(UserContext)

  const getMarkers = async () => {
    const fetchMarkers = await getDoc(doc(db, 'users', currentUser))
    setMarkers([...fetchMarkers.data().markers])
  }

  const getRefreshedMarkers = async () => {
    const fetchMarkers = await getDoc(doc(db, 'users', currentUser))
    let tempmarkers = [...fetchMarkers.data().markers]
    while ([...tempmarkers] === [...markers]) {
      getRefreshedMarkers()
    }
    setMarkers([...tempmarkers])
  }

  const markerIcons = Leaflet.divIcon({
    className: 'trip_marker',
    iconSize: [30, 30],
  })

  useEffect(() => {
      if (refreshMarkers === 0) {
        getMarkers() 
      } else {
        getRefreshedMarkers()
      }  
  }, [refreshMarkers])

  const openLog = (id) => {
    //triggers useEffect in viewLog to query through markers and get details for marker with id = logId
    setLogId(id)
  }
  
  return (
    <MapContainer className='map' center={[49, -80]} zoom={4}>
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