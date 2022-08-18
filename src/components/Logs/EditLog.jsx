import React, {useEffect, useState} from 'react'
import { db } from '../../firebase-config'
import { storage } from '../../firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getDoc, updateDoc, doc } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid';

const EditLog = ({currentMarker}) => {

  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editedMarker, setEditedMarker] = useState()
  const [checkboxRefs, setCheckboxRefs] = useState({
    add: false,
    remove: false
  })
  const [selectedPics, setSelectedPics] = useState([])

  const startEdit = () => {
    setEditing(true)
  }

  const deleteEdit = () => {
    setDeleting(true)
  }

  const submitEdit = (e) => {
    e.preventDefault()
  }

  const submitDelete = (e) => {
    e.preventDefault()
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

  const removePics = async () => {
    
  }

  useEffect(() => {
    setEditedMarker({...currentMarker})
  }, [])

  return (
    <div className='log_container'>
      {!editedMarker ? 
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
          {editedMarker.pics.length > 0 &&
            <div className='check_divs'>
              <label>Remove Pictures?</label>
              <input type="checkbox" value={checkboxRefs.remove} onChange={changeRemove}/>
              {checkboxRefs.remove &&
                <>
                  <p>Select pictures to be removed.</p>
                    <div className='pic_grid'>
                      {editedMarker.pics.map((pic) => (
                        <div key={pic} onClick={() => selectPics(pic)} className={selectedPics.includes(pic) ? "selected_overlay" : ""}>
                          <img src={pic} alt='uploaded user picture'/>
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