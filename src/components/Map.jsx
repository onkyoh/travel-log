import React, {useContext, useState} from 'react'
import { MapContainer, TileLayer, Marker} from 'react-leaflet'
import Leaflet, { marker } from 'leaflet'
import CreateMarker from './CreateMarker'
import { MarkerContext } from '../screens/MainInterface'
import { useEffect } from 'react'

const Map = ({position, setPosition, placingMarker, logId, setLogId, refreshMarkers, setShowLogs, currentTrip}) => {

  const markers = useContext(MarkerContext)

  const markerIcons = Leaflet.divIcon({
    className: 'trip_marker',
    iconSize: [30, 30],
  })

  const currentIcons = Leaflet.divIcon({
    className: 'current_marker',
    iconSize: [30, 30],
  })

  const openLog = (id) => {
    //triggers useEffect in viewLog to query through markers and get details for marker with id = logId
    setLogId(id)
    setShowLogs(true)
  }

  const [tripMarkers, setTripMarkers] = useState()

  useEffect(() => {
    if (currentTrip) {
      let tempTripMarkers = markers.filter(marker => marker.tripId === currentTrip[0].tripId)
      setTripMarkers([...tempTripMarkers])
    }
    else {
      setTripMarkers([...markers])
    }
  }, [currentTrip])
  
  return (
    <MapContainer className='map' center={[49, -80]} zoom={4} minZoom={2} maxBounds={[[-90,-180],   [90,180]] } zoomControl={false}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
          {markers && tripMarkers.map((marker) => (
            <Marker key={marker.id} position={marker.coordinates} icon={marker.id === logId ? currentIcons : markerIcons} eventHandlers={{
              click: () => openLog(marker.id),
            }}/>
        ))}
        <CreateMarker position={position} setPosition={setPosition} placingMarker={placingMarker}/>
    </MapContainer>
  )
}

export default Map