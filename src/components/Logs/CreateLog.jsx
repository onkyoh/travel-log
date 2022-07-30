import { marker } from 'leaflet';
import React,  {useState, useRef, useEffect} from 'react'
import { v4 as uuidv4 } from 'uuid';

const CreateLog = ({position, setPosition, placingMarker, setPlacingMarker}) => {

  const detailsDefault = {
    place: "",
    desc: "",
    coordinates: [],
    pics: [],
    color: ""
  }
  const [newMarker, setNewMarker] = useState(false)
  const [markerDetails, setMarkerDetails] = useState({...detailsDefault})
  const tripNameRef = useRef("")

  const makingNewMarker = () => {
    setNewMarker(true)
  }

  const handlePlacingMarker = () => {
    setPlacingMarker(!placingMarker)
  }

  const handleMarkerDetails = (e, field) => {
    setMarkerDetails({...markerDetails, [field]: e.target.value})
  }

  useEffect(() => {
    if (position) {
    setMarkerDetails({...markerDetails, coordinates: [position.lat, position.lng]})
    console.log(markerDetails)
  }
  }, [position])

  
  const createNewMarker = (e) => {
    e.preventDefault()
    let tempMarker = {...markerDetails}
    if (noTrip) {
      //introduce tempMarker into array of markers on firebase
    }
    let tempTrip = {
      tripId: uuidv4();
      tripName: tripNameRef.current
    }
    //introduce tempMarker into array of markers on firebase
  
  }

  return (
    <div className='log_container create_log'>
      <button onClick={makingNewMarker}>New Marker</button>
      {
      newMarker &&
        <form onSubmit={(e) => createNewMarker(e)}>
          <div>
            <label htmlFor="#place">Location</label>
            <input id="place" placeholder='Toronto, Canada' value={markerDetails.place} onChange={(e) => handleMarkerDetails(e, "place")}/>
          </div>
          <div>
            <label htmlFor="#marker_check">Select to place marker *</label>
            <input id="marker_check" type="checkbox" onChange={handlePlacingMarker}/>
            {position && parseFloat(position.lat).toFixed(3) + ", " + parseFloat(position.lng).toFixed(3)}
          </div>
          <div>
            <label htmlFor="#desc">Description</label>
            <input id="desc" placeholder="In X we did Y..." value={markerDetails.desc} onChange={(e) => handleMarkerDetails(e, "desc")}/>
          </div>
          <div>
            <label htmlFor="#date">Date</label>
            <input id="date" placeholder="DD/MM/YYYY" value={markerDetails.date} onChange={(e) => handleMarkerDetails(e, "date")}/>
          </div>
          <button type='submit'>Create</button>
        </form>
      }
    </div>
  )
}

export default CreateLog