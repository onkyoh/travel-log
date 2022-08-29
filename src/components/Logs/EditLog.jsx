import React, {useEffect, useState, useContext} from 'react'
import { db } from '../../firebase-config'
import { storage } from '../../firebase-config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { getDoc, updateDoc, doc } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid';
import { MarkerContext } from '../../screens/MainInterface';
import { UserContext } from '../../App';

const EditLog = ({currentMarker, setRefreshMarkers, setLogType}) => {

  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editedMarker, setEditedMarker] = useState()
  const [checkboxRefs, setCheckboxRefs] = useState({
    add: false,
    remove: false
  })
  const [selectedPics, setSelectedPics] = useState([])

  const markers = useContext(MarkerContext)
  const currentUser = useContext(UserContext)

  const startEdit = () => {
    setEditing(true)
  }

  const deleteEdit = () => {
    setDeleting(true)
  }

  const deleteImages = (imgArray) => {
    imgArray.forEach((pic) => {
      const imageName = pic.substring(pic.indexOf('/o/') + 3, pic.indexOf('?alt'))
      const imageRef = ref(storage, `${imageName}`)
      deleteObject(imageRef).then(() => {
        console.log(imageName, ' was deleted.')
      }).catch((e) => {
        console.log(e.message)
      })
    })
  }

  const deleteMarker = async () => {
    let newMarkers = [...markers]
    const idx = newMarkers.findIndex(marker => marker.id === currentMarker.id)
    newMarkers.splice(idx, 1)
    await updateDoc((doc(db, 'users', currentUser)), {
      markers: newMarkers
    })
  }

  //deletes marker and images in storage

  const submitDelete = async (e) => {
    e.preventDefault()
    await deleteImages(currentMarker.pics)
    await deleteMarker()
    setRefreshMarkers(prev => prev + 1)
    setLogType("view")
  }

  const handleEdits = (e, field) => {
    setEditedMarker({...editedMarker, [field]: e.target.value})
  }

  const changeAdd = () => {
    setCheckboxRefs({...checkboxRefs, add: !checkboxRefs.add})
  }

  const changeRemove = () => {
    setCheckboxRefs({...checkboxRefs, remove: !checkboxRefs.remove})
  }
  
//add pics to selected array which gets passed to deletePics function on edit submission

  const selectPics = (pic) => {
    const idx = selectedPics.indexOf(pic)
    let tempSelected = [...selectedPics]
    if (idx < 0) {
      tempSelected.push(pic)
      setSelectedPics([...tempSelected])
    } else {
      tempSelected.splice(idx, 1)
      setSelectedPics([...tempSelected])
    }
  }

  const uploadPics = async () => {
    let picArray = [...editedMarker.pics]
    console.log('selected files', picArray)
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

  const deletePicUrls = () => {
    let tempPics = editedMarker.pics
    tempPics = tempPics.filter(url => !selectedPics.includes(url))
    return tempPics
  }

  const submitEdit = async (e) => {
    e.preventDefault()
    console.log('submitting edit')
    let tempMarker = {...editedMarker}
    let picsToUpload = editedMarker.pics
    tempMarker.pics = []

    //if selected pics for removal
    if (selectedPics.length > 0) {
      await deleteImages(selectedPics)
      tempMarker.pics = deletePicUrls()
    }
    //if selected pics for upload
    if (editedMarker.pics.length > 0) {
      // const imageUrls = await uploadPics()
      // tempMarker.pics = imageUrls
      console.log('pics uploaded')
      // tempMarker.pics = [...tempMarker.pics, ...imageUrls]
    }  

    //replacing marker with edited 1
    let newMarkers = [...markers]
    const idx = newMarkers.findIndex(marker => marker.id === tempMarker.id)
    if (idx > -1) {
      newMarkers[idx] = tempMarker
      await updateDoc((doc(db, 'users', currentUser)), {
        markers: [...newMarkers]
      })
    }
    //clean up after edit
    setRefreshMarkers(prev => prev + 1)
    setLogType('view')
  }

  useEffect(() => {
    setEditedMarker({...currentMarker})
  }, [currentMarker])

  return (
    <div className='log_container'>
      {!currentMarker ? 
        <p>Please select a marker to edit.</p>
        :
        <>
        {(!editing && !deleting) &&
          <div className='edit_buttons'>
            <button onClick={startEdit}>Edit</button>
            <button onClick={deleteEdit}>Delete</button>
          </div>
        }
        </>
      }
      {editing &&
      <div className='create_log'> 
        <form onSubmit={(e) => submitEdit(e)} className='edit_form'>
          <div>
            <label>Location</label>
            <input type="text" value={editedMarker.place} onChange={(e) => handleEdits(e, "place")}/>
          </div>
          <div> 
            <label>Date</label>
            <input type="text" value={editedMarker.date} onChange={(e) => handleEdits(e, "date")}/>
          </div>
          <div>
            <label>Description</label>
            <textarea id="desc" maxLength={140} placeholder="In X we did Y..." value={editedMarker.desc} onChange={(e) => handleEdits(e, "desc")}/>
            <span style={{float: "right"}}>{editedMarker.desc.length || 0}/140</span>
          </div>
          <div className='check_divs'>
            <label>Add Pictures</label>
            <input type="checkbox" value={checkboxRefs.add} onChange={changeAdd}/>
            {checkboxRefs.add && 
            <input type="file" multiple accept="image/*" onChange={(e) => handleEdits(e, "pics")}/>
            }
          </div>
          {editedMarker.pics &&
            <div className='check_divs'>
              <label>Remove Pictures?</label>
              <input type="checkbox" value={checkboxRefs.remove} onChange={changeRemove}/>
              {checkboxRefs.remove &&
                <>
                  <p>Select pictures to be removed.</p>
                    <div className='pic_grid'>
                      {editedMarker.pics.map((pic) => (
                        <div key={pic} onClick={() => selectPics(pic)} 
                        className={selectedPics.includes(pic) ? "selected_overlay" : ""}
                        style={{cursor: 'pointer', userSelect: 'none'}}>
                          <img src={pic} alt='trip memories'/>
                        </div>
                      ))}
                    </div>
                </>
              }
            </div>
          }
          <div className='check_divs'>
            <label>Add to a Trip?</label>
            <input type="checkbox" />
          </div>
          <button type='submit'>Submit</button>
        </form>
      </div>
      }
      {deleting && 
        <form onSubmit={(e) => submitDelete(e)} className='delete_form'>
          <h4>By checking the box and clicking 'confirm' you acknowledge that you are permanently deleting the selected marker and its containing data.</h4>
          <input type="checkbox" name="delete_log" id="delete_log"/>
          <button>Confirm</button>
        </form>
      }
    </div>
  )
}

export default EditLog