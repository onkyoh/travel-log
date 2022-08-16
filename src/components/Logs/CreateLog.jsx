import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { storage } from '../../firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import React, {useState, useRef, useEffect, useContext} from 'react'
import {UserContext} from '../../App'
import { MarkerContext } from '../../screens/MainInterface'
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
  const [spinnerClassName, setSpinnerClassName] = useState('')

  const currentUser = useContext(UserContext)
  const markers = useContext(MarkerContext)

  const date = new Date()

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

  //get current date

  const handleCurrentDate = () => {
    const currentDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
    setMarkerDetails({...markerDetails, date: currentDate})
  }

  //updates on every input field change

  const handleMarkerDetails = (e, field) => {
    if (field === 'pics') {
      setMarkerDetails({...markerDetails, pics: e.target.files})
      return
    }
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
    if (markerDetails.date && markerDetails.date.length > 10) {
      error = 'Date cannot be longer than 10 characters long.'
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

  const uploadPics = async () => {
    let picArray = [...markerDetails.pics]

    const fetchMap = async () => {
        return Promise.all(picArray.map(async(pic, i) => {
        const imageRef = ref(storage, `/${uuidv4()}`)
        const uploaded = await uploadBytes(imageRef, picArray[i])
        if (!uploaded) {
          return
        }
        const url = await getDownloadURL(ref(imageRef))
        return url
      }))
    }
    return fetchMap()
  }

  const createNewMarker = async (e) => {
    e.preventDefault()
    setSpinnerClassName(() => 'spinner')
    const validationError = logValidation()

    if (validationError) {
      setError(validationError)
      errorRef.current.scrollIntoView()
      setSpinnerClassName('')
      return
    }
    
    let tempMarker = {...markerDetails}

    if (tempMarker.pics.length > 0) {
      const imageUrls = await uploadPics()
      console.log('image urls', imageUrls)
      tempMarker = {...tempMarker, pics: imageUrls}
    } 
      
    tempMarker = {...tempMarker, id: uuidv4()}

    console.log(tempMarker)

    if (noTrip) {
      //introduce tempMarker into array of markers on firebase
      await updateDoc((doc(db, 'users', currentUser)), {
        markers: [...markers, tempMarker]
      })
      setLogType("view")
      setPosition(null)
      setSpinnerClassName('')
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
        markers: [...markers, tempMarker],
        trips: [...tripNames, tempTrip]
      })
      setLogType("view")
      setPosition(null)
      setSpinnerClassName('')
      return
    }

    if (!noTrip && selectValue !== 'new') {
      const idx = tripNames.findIndex(trip => trip.tripName === selectValue)
      let existingTripId = tripNames[idx].tripId
      tempMarker.tripId = existingTripId
      await updateDoc((doc(db, 'users', currentUser)), {
        markers: [...markers, tempMarker]
      })
      setLogType("view")
      setPosition(null)
      setSpinnerClassName('')
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
          <span className={spinnerClassName}></span>
          <span style={{color: 'red', textAlign: 'center'}} ref={errorRef}>{error}</span>
          <div>
            <label htmlFor="place">Location</label>
            <input id="place" placeholder='Toronto, Canada' value={markerDetails.place  || ""} onChange={(e) => handleMarkerDetails(e, "place")}/>
          </div>
          <div>
            <label htmlFor="marker_check">Coordinates *</label>
            <div className='marker_input'>
              <span>
                {position && parseFloat(position.lat).toFixed(2) + ", " + parseFloat(position.lng).toFixed(2)}
              </span>
              <input id="marker_check" type="checkbox" onChange={handlePlacingMarker}/>
              <button type="button" onClick={handleCurrentLocation} className='img_button'><img src="https://img.icons8.com/color/48/000000/marker--v1.png" alt="current_location" /></button>
            </div>
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <div className='date_input'>
              <input id="date" placeholder="DD/MM/YYYY" value={markerDetails.date || ""} onChange={(e) => handleMarkerDetails(e, "date")}/>
              <button type='button' onClick={handleCurrentDate}>Today</button>
            </div>
          </div>
          <div>
            <label htmlFor="desc">Description</label>
            <textarea id="desc" maxLength={140} placeholder="In X we did Y..." value={markerDetails.desc  || ""} onChange={(e) => handleMarkerDetails(e, "desc")}/>
            <span style={{float: "right"}}>{markerDetails.desc.length || 0}/140</span>
          </div>
          <div>
            <label htmlFor="pics">Pictures</label>
            <input id='pics' type="file" multiple accept="image/*" onChange={(e) => handleMarkerDetails(e, "pics")}/>
          </div>
          <div className='trip_input'>
            <label htmlFor="trip_check">Was this part of a trip?</label>
            <input id="trip_check" type="checkbox" onChange={handleTripCheck}/>
          </div>

        {/* Trip info Input area */}

          { !noTrip &&
          <div>
            <div>
              <label htmlFor="trips">Which Trip?</label>
              <select name="trip_select" id="trip_select" value={selectValue} onChange={(e) => handleTripSelection(e)}>
                <option value="default" disabled> -- select an option -- </option>
                <option value="new">+ New Trip</option>
                {tripNames.map((trip) => (
                  <option key={trip.tripId} value={trip.tripName}>{trip.tripName}</option>
                ))}
              </select>
            </div>
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