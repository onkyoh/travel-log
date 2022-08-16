import React, {useEffect, useState} from 'react'
import { db } from '../../firebase-config'
import { getDoc, updateDoc, doc } from 'firebase/firestore'

const EditLog = ({currentMarker}) => {

  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

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

  useEffect(() => {
    console.log(editing, deleting)
  }, [])

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
        <form onSubmit={(e) => submitEdit(e)}>
          <p>editing...</p>
        </form>
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