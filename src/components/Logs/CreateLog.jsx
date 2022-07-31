import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { marker } from 'leaflet';
import React, {useState, useRef, useEffect, useContext, useMemo} from 'react'
import {UserContext} from '../../App'
import { v4 as uuidv4 } from 'uuid';

const CreateLog = ({position, setPosition, placingMarker, setPlacingMarker, setLogType}) => {

  const detailsDefault = {
    place: "",
    desc: "",
    date: "",
    coordinates: [],
    pics: [],
    color: ""
  }
  const [newMarker, setNewMarker] = useState(false)
  const [markerDetails, setMarkerDetails] = useState({...detailsDefault})
  const tripNameRef = useRef("")
  const [selectValue, setSelectValue] = useState("default")
  const [noTrip, setNoTrip] = useState(true)
  const [tripNames, setTripNames] = useState([])
  const [error, setError] = useState("")
  const errorRef = useRef("")

  const currentUser = useContext(UserContext)

  //start create log process

  const makingNewMarker = () => {
    setNewMarker(true)
  }

  // toggle to allow placing of marker on make to set location

  const handlePlacingMarker = () => {
    if (placingMarker) {
      setPosition(null)
    }
    setPlacingMarker(!placingMarker)
  }

  //get current location

  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition({lat: position.coords.latitude, lng: position.coords.longitude})
    },
    () => {
      console.log('couldnt fetch location')
    })
  }

  //updates on every input field change

  const handleMarkerDetails = (e, field) => {
    setMarkerDetails({...markerDetails, [field]: e.target.value})
  }

  //self-explanatory

  const fetchTripNames = async () => {
    const fetchedTrips = await getDoc(doc(db, 'users', currentUser))
    const tempTripNames = fetchedTrips.data()
    if (tempTripNames.trips.length !== 0) {
      setTripNames([...tempTripNames.trips])
    }
      console.log(tempTripNames)
  }

  const handleTripCheck = () => {
    setNoTrip(!noTrip)
    if (tripNames.length === 0) {
      fetchTripNames()
    }
    if (!noTrip) {
      setSelectValue('default')
    }
  }

  const handleTripSelection = (e) => {
    setSelectValue(e.target.value)
  }
  
  //validation

  const logValidation = () => {
    let error = ''
    if (markerDetails.coordinates < 2) {
        error = 'Must include coordinates for marker.'
    }
    if (!noTrip && selectValue === 'default') {
      error = 'Must add to an old trip or create a new trip.'
    }
    // new trip + unique trip name
    if (selectValue === 'new') {
      if (!tripNameRef.current.value) {
        error = 'Must name this new trip.'
      }
      const idx = tripNames.findIndex(trip => trip.tripName === tripNameRef.current.value.trim())
      if (idx !== -1) {
        error = 'Cannot have 2 trips with the same name.'
      }
    }
    return error
}

  //form submit to create marker

  const createNewMarker = async (e) => {
    e.preventDefault()
    const validationError = logValidation()

    if (validationError) {
      setError(validationError)
      errorRef.current.scrollIntoView()
      return
    }

    const fetchMarkers = await getDoc(doc(db, 'users', currentUser))
    let storedMarkers = [...fetchMarkers.data().markers]
    let tempMarker = {...markerDetails, id: uuidv4()}

    if (noTrip) {
      //introduce tempMarker into array of markers on firebase
      await updateDoc((doc(db, 'users', currentUser)), {
        markers: [...storedMarkers, tempMarker]
      })
      setLogType("view")
      return
    }

    //introduce tempMarker into array of markers on firebase

    if (!noTrip && selectValue === 'new') {
      const tripId = uuidv4()
      tempMarker.tripId = tripId
      let tempTrip = {
        tripId: tripId,
        tripName: tripNameRef.current.value.trim()
      }
      await updateDoc((doc(db, 'users', currentUser)), {
        markers: [...storedMarkers, tempMarker],
        trips: [...tripNames, tempTrip]
      })
      setLogType("view")
      return
    }

    if (!noTrip && selectValue !== 'new') {
      const idx = tripNames.findIndex(trip => trip.tripName === selectValue)
      let existingTripId = tripNames[idx].tripId
      tempMarker.tripId = existingTripId
      await updateDoc((doc(db, 'users', currentUser)), {
        markers: [...storedMarkers, tempMarker]
      })
      setLogType("view")
      return
    }
  }

  useEffect(() => {
    if (position) {
      setMarkerDetails({...markerDetails, coordinates: [position.lat, position.lng]})
    }
  }, [position])


  return (
    <div className='log_container create_log'>
      {!newMarker && <button onClick={makingNewMarker}>New Marker</button>}
      {
      newMarker &&
        <form onSubmit={(e) => createNewMarker(e)}>
          <div>
            <span style={{color: 'red'}} ref={errorRef}>{error}</span>
            <label htmlFor="place">Location</label>
            <input id="place" placeholder='Toronto, Canada' value={markerDetails.place  || ""} onChange={(e) => handleMarkerDetails(e, "place")}/>
          </div>
          <div>
            <label htmlFor="marker_check">Coordinates *</label>
            <div className='marker_input'>
              <span>
                {position && parseFloat(position.lat).toFixed(3) + ", " + parseFloat(position.lng).toFixed(3)}
              </span>
              <input id="marker_check" type="checkbox" onChange={handlePlacingMarker}/>
              <button type="button" onClick={handleCurrentLocation} className='img_button'><img src="https://img.icons8.com/color/48/000000/marker--v1.png" alt="current_location" /></button>
            </div>
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <input id="date" placeholder="DD/MM/YYYY" value={markerDetails.date || ""} onChange={(e) => handleMarkerDetails(e, "date")}/>
          </div>
          <div>
            <label htmlFor="desc">Description</label>
            <textarea id="desc" maxLength={140} placeholder="In X we did Y..." value={markerDetails.desc  || ""} onChange={(e) => handleMarkerDetails(e, "desc")}/>
            <span style={{float: "right"}}>{markerDetails.desc.length || 0}/140</span>
          </div>
          <div>
            {/* TODO: ADD PIC UPLOADING */}
          </div>
          <div>
            <label htmlFor="trip_check">Was this part of a trip?</label>
            <input id="trip_check" type="checkbox" onChange={handleTripCheck}/>
          </div>
          { !noTrip &&
          <div>
              <label htmlFor="trips">Which Trip?</label>
              <select name="trip_select" id="trip_select" value={selectValue} onChange={(e) => handleTripSelection(e)}>
                <option value="default" disabled> -- select an option -- </option>
                <option value="new">+ New Trip</option>
                {tripNames.map((trip) => (
                  <option key={trip.tripId} value={trip.tripName}>{trip.tripName}</option>
                ))}
              </select>
              {selectValue === 'new' &&
           <div>
             <label htmlFor="trip_name">Create a name for this trip *</label>
             <input type="text" placeholder='New Trip Name' id='trip_name' ref={tripNameRef}/>
           </div>
           }
          </div>
          }
          <button type='submit'>Create</button>
        </form>
      }
    </div>
  )
}

export default CreateLog