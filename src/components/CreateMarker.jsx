import React, { useEffect, useState } from 'react'
import { Marker, useMapEvents} from 'react-leaflet'
import Leaflet from 'leaflet'

const CreateMarker = ({position, setPosition, placingMarker}) => {


    const map = useMapEvents({
        click(e) {
            if (placingMarker) {
                setPosition(e.latlng)
            }
        }
    })

    const createMarker = Leaflet.divIcon({
        className: 'new_marker',
        iconSize: [30, 30],
      })

    useEffect(() => {
       if (position) {
            map.flyTo([position.lat, position.lng])
        }
    }, [position])

  return (
    position && <Marker position={position} icon={createMarker}/>
  )
}

export default CreateMarker