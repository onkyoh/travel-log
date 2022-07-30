import React, { useState } from 'react'
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

  return (
    position && <Marker position={position} icon={createMarker}/>
  )
}

export default CreateMarker